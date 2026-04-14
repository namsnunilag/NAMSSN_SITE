-- ── Decagon 5.0 — Supabase table setup ──────────────────────────────────────
-- Run this in the Supabase SQL editor:
-- supabase.com → your project → SQL Editor → New query → paste & run

-- Competition registrations
CREATE TABLE IF NOT EXISTS decagon_registrations (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name       TEXT        NOT NULL,
  email           TEXT        NOT NULL,
  phone           TEXT        NOT NULL,
  matric          TEXT        NOT NULL UNIQUE,
  department      TEXT        NOT NULL,
  level           TEXT        NOT NULL,
  payment_status  TEXT        NOT NULL DEFAULT 'pending',  -- 'pending' | 'paid'
  payment_ref     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 20-Day Challenge signups
CREATE TABLE IF NOT EXISTS challenge_signups (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name   TEXT        NOT NULL,
  email       TEXT        NOT NULL UNIQUE,
  department  TEXT        NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ── Row Level Security ────────────────────────────────────────────────────────
-- Allow anonymous inserts (the website uses the anon key)
ALTER TABLE decagon_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_signups     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow anon insert registrations"
  ON decagon_registrations FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "allow anon insert signups"
  ON challenge_signups FOR INSERT TO anon WITH CHECK (true);

-- ── Optional: Paystack webhook handler (update payment_status to 'paid') ──────
-- After verifying the webhook signature server-side, run:
-- UPDATE decagon_registrations
--   SET payment_status = 'paid', payment_ref = '<ref>'
--   WHERE matric = '<matric>';
-- (Do this via a Supabase Edge Function or your own webhook endpoint)
