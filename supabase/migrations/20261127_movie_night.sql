CREATE OR REPLACE FUNCTION public.is_namssn_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

REVOKE ALL ON FUNCTION public.is_namssn_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_namssn_admin() TO authenticated;

CREATE TABLE IF NOT EXISTS public.movie_night_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_ref TEXT NOT NULL UNIQUE,
  ticket_type TEXT NOT NULL CHECK (ticket_type IN ('single', 'couples')),
  ticket_count INT NOT NULL CHECK (ticket_count IN (1, 2)),
  amount_ngn INT NOT NULL CHECK (amount_ngn IN (2000, 3500)),
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_phone TEXT NOT NULL,
  payer_account_name TEXT NOT NULL,
  partner_name TEXT,
  partner_email TEXT,
  receipt_path TEXT NOT NULL,
  receipt_hash TEXT NOT NULL UNIQUE,
  payment_status TEXT NOT NULL DEFAULT 'unconfirmed'
    CHECK (payment_status IN ('unconfirmed', 'confirmed', 'declined')),
  decline_reason TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT movie_night_order_tier_details CHECK (
    (ticket_type = 'single' AND ticket_count = 1 AND amount_ngn = 2000
      AND partner_name IS NULL AND partner_email IS NULL)
    OR
    (ticket_type = 'couples' AND ticket_count = 2 AND amount_ngn = 3500
      AND nullif(btrim(partner_name), '') IS NOT NULL
      AND nullif(btrim(partner_email), '') IS NOT NULL
      AND lower(buyer_email) <> lower(partner_email))
  ),
  CONSTRAINT movie_night_decline_reason_required CHECK (
    payment_status <> 'declined' OR nullif(btrim(decline_reason), '') IS NOT NULL
  )
);

CREATE TABLE IF NOT EXISTS public.movie_night_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.movie_night_orders(id) ON DELETE CASCADE,
  ticket_code TEXT NOT NULL UNIQUE,
  ticket_type TEXT NOT NULL CHECK (ticket_type IN ('single', 'couples')),
  holder_role TEXT NOT NULL CHECK (holder_role IN ('primary', 'partner')),
  holder_name TEXT NOT NULL,
  holder_email TEXT NOT NULL,
  email_sent BOOLEAN NOT NULL DEFAULT false,
  email_error TEXT,
  checked_in BOOLEAN NOT NULL DEFAULT false,
  checked_in_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS movie_night_orders_created_at_idx
  ON public.movie_night_orders (created_at DESC);
CREATE INDEX IF NOT EXISTS movie_night_orders_status_idx
  ON public.movie_night_orders (payment_status, created_at DESC);
CREATE INDEX IF NOT EXISTS movie_night_tickets_order_id_idx
  ON public.movie_night_tickets (order_id);
CREATE INDEX IF NOT EXISTS movie_night_tickets_checked_in_idx
  ON public.movie_night_tickets (checked_in);

ALTER TABLE public.movie_night_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movie_night_tickets ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.movie_night_orders, public.movie_night_tickets
  FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.movie_night_orders, public.movie_night_tickets
  TO authenticated;

DROP POLICY IF EXISTS "admins read movie night orders" ON public.movie_night_orders;
CREATE POLICY "admins read movie night orders"
  ON public.movie_night_orders FOR SELECT TO authenticated
  USING (public.is_namssn_admin());
DROP POLICY IF EXISTS "admins read movie night tickets" ON public.movie_night_tickets;
CREATE POLICY "admins read movie night tickets"
  ON public.movie_night_tickets FOR SELECT TO authenticated
  USING (public.is_namssn_admin());

CREATE OR REPLACE FUNCTION public.movie_night_capacity()
RETURNS TABLE (ticket_slots BIGINT, max_tickets INT, remaining INT)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT
    coalesce(sum(o.ticket_count), 0)::BIGINT,
    100,
    greatest(100 - coalesce(sum(o.ticket_count), 0)::INT, 0)
  FROM public.movie_night_orders AS o
  WHERE o.payment_status IN ('confirmed', 'unconfirmed')
$$;

CREATE OR REPLACE FUNCTION public.movie_night_submit_order(
  p_ticket_type TEXT,
  p_buyer_name TEXT,
  p_buyer_email TEXT,
  p_buyer_phone TEXT,
  p_payer_account_name TEXT,
  p_partner_name TEXT,
  p_partner_email TEXT,
  p_receipt_path TEXT,
  p_receipt_hash TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_ticket_count INT;
  v_amount_ngn INT;
  v_used_slots BIGINT;
  v_order_ref TEXT;
  v_order public.movie_night_orders%ROWTYPE;
  v_attempt INT;
BEGIN
  IF p_ticket_type IS NULL OR p_ticket_type NOT IN ('single', 'couples') THEN
    RAISE EXCEPTION 'invalid_ticket_type';
  END IF;
  IF nullif(btrim(p_buyer_name), '') IS NULL
    OR nullif(btrim(p_buyer_email), '') IS NULL
    OR nullif(btrim(p_buyer_phone), '') IS NULL
    OR nullif(btrim(p_payer_account_name), '') IS NULL
    OR nullif(btrim(p_receipt_path), '') IS NULL
    OR nullif(btrim(p_receipt_hash), '') IS NULL THEN
    RAISE EXCEPTION 'required_details_missing';
  END IF;

  IF p_ticket_type = 'couples' THEN
    IF nullif(btrim(p_partner_name), '') IS NULL
      OR nullif(btrim(p_partner_email), '') IS NULL
      OR lower(btrim(p_buyer_email)) = lower(btrim(p_partner_email)) THEN
      RAISE EXCEPTION 'invalid_partner_details';
    END IF;
    v_ticket_count := 2;
    v_amount_ngn := 3500;
  ELSE
    IF p_partner_name IS NOT NULL OR p_partner_email IS NOT NULL THEN
      RAISE EXCEPTION 'unexpected_partner_details';
    END IF;
    v_ticket_count := 1;
    v_amount_ngn := 2000;
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext('namssn-movie-night-capacity'));

  IF EXISTS (
    SELECT 1 FROM public.movie_night_orders WHERE receipt_hash = p_receipt_hash
  ) THEN
    RAISE EXCEPTION 'duplicate_receipt';
  END IF;

  SELECT coalesce(sum(ticket_count), 0)
  INTO v_used_slots
  FROM public.movie_night_orders
  WHERE payment_status IN ('confirmed', 'unconfirmed');

  IF v_used_slots + v_ticket_count > 100 THEN
    IF v_used_slots >= 100 THEN
      RAISE EXCEPTION 'tickets_sold_out';
    END IF;
    RAISE EXCEPTION 'only_one_ticket_spot_remains';
  END IF;

  FOR v_attempt IN 1..10 LOOP
    v_order_ref := 'MNO-' || upper(substr(replace(gen_random_uuid()::TEXT, '-', ''), 1, 4));
    BEGIN
      INSERT INTO public.movie_night_orders (
        order_ref, ticket_type, ticket_count, amount_ngn, buyer_name, buyer_email,
        buyer_phone, payer_account_name, partner_name, partner_email, receipt_path, receipt_hash
      ) VALUES (
        v_order_ref, p_ticket_type, v_ticket_count, v_amount_ngn, btrim(p_buyer_name),
        lower(btrim(p_buyer_email)), btrim(p_buyer_phone), btrim(p_payer_account_name),
        nullif(btrim(p_partner_name), ''), nullif(lower(btrim(p_partner_email)), ''),
        p_receipt_path, lower(p_receipt_hash)
      )
      RETURNING * INTO v_order;

      RETURN jsonb_build_object(
        'id', v_order.id,
        'order_ref', v_order.order_ref,
        'ticket_count', v_order.ticket_count,
        'amount_ngn', v_order.amount_ngn,
        'payment_status', v_order.payment_status
      );
    EXCEPTION WHEN unique_violation THEN
      IF EXISTS (
        SELECT 1 FROM public.movie_night_orders WHERE receipt_hash = lower(p_receipt_hash)
      ) THEN
        RAISE EXCEPTION 'duplicate_receipt';
      END IF;
    END;
  END LOOP;

  RAISE EXCEPTION 'could_not_create_order_reference';
END;
$$;

CREATE OR REPLACE FUNCTION public.movie_night_confirm_order(
  p_order_id UUID,
  p_reviewed_by TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_order public.movie_night_orders%ROWTYPE;
  v_ticket public.movie_night_tickets%ROWTYPE;
  v_holder_name TEXT;
  v_holder_email TEXT;
  v_holder_role TEXT;
  v_ticket_code TEXT;
  v_ticket_json JSONB := '[]'::JSONB;
  v_attempt INT;
  v_index INT;
  v_ticket_created BOOLEAN;
BEGIN
  UPDATE public.movie_night_orders
  SET payment_status = 'confirmed',
      decline_reason = NULL,
      reviewed_by = p_reviewed_by,
      reviewed_at = now()
  WHERE id = p_order_id AND payment_status = 'unconfirmed'
  RETURNING * INTO v_order;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('confirmed', false, 'tickets', '[]'::JSONB);
  END IF;

  FOR v_index IN 1..v_order.ticket_count LOOP
    IF v_index = 1 THEN
      v_holder_name := v_order.buyer_name;
      v_holder_email := v_order.buyer_email;
      v_holder_role := 'primary';
    ELSE
      v_holder_name := v_order.partner_name;
      v_holder_email := v_order.partner_email;
      v_holder_role := 'partner';
    END IF;

    v_ticket_created := false;
    FOR v_attempt IN 1..10 LOOP
      v_ticket_code := 'MN26-' || upper(substr(replace(gen_random_uuid()::TEXT, '-', ''), 1, 4));
      INSERT INTO public.movie_night_tickets (
        order_id, ticket_code, ticket_type, holder_role, holder_name, holder_email
      ) VALUES (
        v_order.id, v_ticket_code, v_order.ticket_type, v_holder_role, v_holder_name, v_holder_email
      )
      ON CONFLICT (ticket_code) DO NOTHING
      RETURNING * INTO v_ticket;

      IF FOUND THEN
        v_ticket_created := true;
        EXIT;
      END IF;
    END LOOP;

    IF NOT v_ticket_created THEN
      RAISE EXCEPTION 'could_not_create_ticket_code';
    END IF;

    v_ticket_json := v_ticket_json || jsonb_build_array(to_jsonb(v_ticket));
  END LOOP;

  RETURN jsonb_build_object(
    'confirmed', true,
    'order_id', v_order.id,
    'order_ref', v_order.order_ref,
    'tickets', v_ticket_json
  );
END;
$$;

REVOKE ALL ON FUNCTION public.movie_night_capacity() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.movie_night_submit_order(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.movie_night_confirm_order(UUID, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.movie_night_capacity() TO service_role;
GRANT EXECUTE ON FUNCTION public.movie_night_submit_order(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) TO service_role;
GRANT EXECUTE ON FUNCTION public.movie_night_confirm_order(UUID, TEXT) TO service_role;
GRANT ALL ON TABLE public.movie_night_orders, public.movie_night_tickets TO service_role;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'movie-night-receipts',
  'movie-night-receipts',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

DROP POLICY IF EXISTS "admins manage movie night receipts" ON storage.objects;
CREATE POLICY "admins manage movie night receipts"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'movie-night-receipts' AND public.is_namssn_admin());

NOTIFY pgrst, 'reload schema';
