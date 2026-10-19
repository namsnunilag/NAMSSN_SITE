-- ── Decagon 5.0 — Supabase setup ─────────────────────────────────────────────
-- Go to: supabase.com → your project → SQL Editor → New query → paste & Run

-- 1. Competition registrations table
CREATE TABLE IF NOT EXISTS decagon_registrations (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name       TEXT        NOT NULL,
  email           TEXT        NOT NULL,
  phone           TEXT        NOT NULL,
  matric          TEXT        NOT NULL UNIQUE,
  department      TEXT        NOT NULL,
  level           TEXT        NOT NULL,
  receipt_url     TEXT,
  payment_status  TEXT        NOT NULL DEFAULT 'pending_review',
  score           INT         NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 20-Day Challenge signups table
CREATE TABLE IF NOT EXISTS challenge_signups (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name      TEXT        NOT NULL,
  email          TEXT        NOT NULL UNIQUE,
  department     TEXT        NOT NULL,
  score          INT         NOT NULL DEFAULT 0,
  days_completed INT         NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Storage bucket for payment receipts
INSERT INTO storage.buckets (id, name, public)
VALUES ('decagon-receipts', 'decagon-receipts', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- 4. Row Level Security
ALTER TABLE decagon_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_signups     ENABLE ROW LEVEL SECURITY;

-- 3b. Decagon merch orders table
CREATE TABLE IF NOT EXISTS decagon_merch_orders (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name      TEXT        NOT NULL,
  email          TEXT        NOT NULL,
  phone          TEXT        NOT NULL,
  color          TEXT        NOT NULL,
  size           TEXT        NOT NULL,
  quantity       INT         NOT NULL DEFAULT 1,
  amount         INT         NOT NULL,
  receipt_url    TEXT,
  status         TEXT        NOT NULL DEFAULT 'pending_review',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE decagon_merch_orders ENABLE ROW LEVEL SECURITY;

-- 3c. Grand Finale attendance registrations
CREATE TABLE IF NOT EXISTS decagon_attendance (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name    TEXT        NOT NULL,
  email        TEXT        NOT NULL UNIQUE,
  phone        TEXT        NOT NULL UNIQUE,
  student_type TEXT        NOT NULL,   -- 'unilag' or 'non-unilag'
  ticket_id    TEXT        NOT NULL UNIQUE,
  meal_ticket  INT         NOT NULL DEFAULT 1,
  is_freebie   BOOLEAN     NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE decagon_attendance ENABLE ROW LEVEL SECURITY;

-- 3d. Dean's Games jersey preorders
CREATE TABLE IF NOT EXISTS deans_games_jersey_orders (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name      TEXT        NOT NULL,
  email          TEXT        NOT NULL,
  phone          TEXT        NOT NULL,
  jersey_name    TEXT        NOT NULL,
  jersey_number  TEXT        NOT NULL,
  size           TEXT        NOT NULL,
  amount         INT         NOT NULL DEFAULT 12000,
  receipt_url    TEXT,
  status         TEXT        NOT NULL DEFAULT 'pending_review',
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE deans_games_jersey_orders ENABLE ROW LEVEL SECURITY;

-- ── Score columns (run once if tables already exist) ──────────────────────────
-- If you created the tables before this update, run these ALTER statements:
--   ALTER TABLE decagon_registrations ADD COLUMN IF NOT EXISTS score INT DEFAULT 0;
--   ALTER TABLE challenge_signups     ADD COLUMN IF NOT EXISTS score INT DEFAULT 0;
--   ALTER TABLE challenge_signups     ADD COLUMN IF NOT EXISTS days_completed INT DEFAULT 0;

-- ── Security hardening ──────────────────────────────────────────────────────
-- Run this complete file on the target project before enabling submissions.

CREATE OR REPLACE FUNCTION public.is_namssn_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

REVOKE ALL ON FUNCTION public.is_namssn_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_namssn_admin() TO authenticated;

DO $$
DECLARE
  policy_row RECORD;
  function_row RECORD;
BEGIN
  FOR policy_row IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE (schemaname = 'public' AND tablename IN (
      'decagon_registrations', 'challenge_signups', 'decagon_merch_orders',
      'decagon_attendance', 'deans_games_jersey_orders', 'giveaway_entries',
      'admin_audit_log'
    ))
      OR (schemaname = 'storage' AND tablename = 'objects'
          AND (coalesce(qual, '') || coalesce(with_check, '')) ILIKE '%decagon-receipts%')
  LOOP
    EXECUTE format('DROP POLICY %I ON %I.%I', policy_row.policyname, policy_row.schemaname, policy_row.tablename);
  END LOOP;

  FOR function_row IN
    SELECT p.oid::regprocedure AS signature
    FROM pg_proc p
    JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname = 'enter_giveaway'
  LOOP
    EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', function_row.signature);
  END LOOP;
END $$;

ALTER TABLE public.decagon_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decagon_merch_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decagon_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deans_games_jersey_orders ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.decagon_registrations, public.challenge_signups,
  public.decagon_merch_orders, public.decagon_attendance,
  public.deans_games_jersey_orders FROM PUBLIC, anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.decagon_registrations,
  public.challenge_signups, public.decagon_merch_orders,
  public.decagon_attendance, public.deans_games_jersey_orders TO authenticated;

CREATE POLICY "admins manage registrations" ON public.decagon_registrations
  FOR ALL TO authenticated USING (public.is_namssn_admin())
  WITH CHECK (public.is_namssn_admin());
CREATE POLICY "admins manage challenge signups" ON public.challenge_signups
  FOR ALL TO authenticated USING (public.is_namssn_admin())
  WITH CHECK (public.is_namssn_admin());
CREATE POLICY "admins manage merch orders" ON public.decagon_merch_orders
  FOR ALL TO authenticated USING (public.is_namssn_admin())
  WITH CHECK (public.is_namssn_admin());
CREATE POLICY "admins manage attendance" ON public.decagon_attendance
  FOR ALL TO authenticated USING (public.is_namssn_admin())
  WITH CHECK (public.is_namssn_admin());
CREATE POLICY "admins manage jersey orders" ON public.deans_games_jersey_orders
  FOR ALL TO authenticated USING (public.is_namssn_admin())
  WITH CHECK (public.is_namssn_admin());

-- Anonymous access stays closed while all legacy Decagon routes are retired.
UPDATE storage.buckets SET public = false WHERE id = 'decagon-receipts';
CREATE POLICY "admins manage private receipts" ON storage.objects
  FOR ALL TO authenticated
  USING (bucket_id = 'decagon-receipts' AND public.is_namssn_admin())
  WITH CHECK (bucket_id = 'decagon-receipts' AND public.is_namssn_admin());

-- Giveaway records and RPC are closed until a server-validated flow is deployed.
DO $$
BEGIN
  IF to_regclass('public.giveaway_entries') IS NOT NULL THEN
    EXECUTE 'ALTER TABLE public.giveaway_entries ENABLE ROW LEVEL SECURITY';
    EXECUTE 'REVOKE ALL ON TABLE public.giveaway_entries FROM PUBLIC, anon, authenticated';
    EXECUTE 'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.giveaway_entries TO authenticated';
    EXECUTE 'CREATE POLICY "admins manage giveaway entries" ON public.giveaway_entries
      FOR ALL TO authenticated USING (public.is_namssn_admin())
      WITH CHECK (public.is_namssn_admin())';
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('UPDATE', 'DELETE')),
  row_id TEXT,
  actor UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.admin_audit_log FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.admin_audit_log TO authenticated;
CREATE POLICY "admins read audit log" ON public.admin_audit_log
  FOR SELECT TO authenticated USING (public.is_namssn_admin());

CREATE OR REPLACE FUNCTION public.audit_namssn_admin_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  changed_row JSONB;
BEGIN
  changed_row := CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(NEW) END;
  INSERT INTO public.admin_audit_log (table_name, operation, row_id, actor)
  VALUES (TG_TABLE_NAME, TG_OP, changed_row ->> 'id', auth.uid());
  RETURN CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END;
END;
$$;

DO $$
DECLARE
  table_name TEXT;
BEGIN
  FOREACH table_name IN ARRAY ARRAY[
    'decagon_registrations', 'challenge_signups', 'decagon_merch_orders',
    'decagon_attendance', 'deans_games_jersey_orders', 'giveaway_entries'
  ] LOOP
    IF to_regclass(format('public.%I', table_name)) IS NOT NULL THEN
      EXECUTE format('DROP TRIGGER IF EXISTS audit_admin_change ON public.%I', table_name);
      EXECUTE format('CREATE TRIGGER audit_admin_change
        AFTER UPDATE OR DELETE ON public.%I
        FOR EACH ROW EXECUTE FUNCTION public.audit_namssn_admin_change()', table_name);
    END IF;
  END LOOP;
END $$;
