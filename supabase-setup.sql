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
VALUES ('decagon-receipts', 'decagon-receipts', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Row Level Security
ALTER TABLE decagon_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_signups     ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (the website uses the anon key)
CREATE POLICY "anon can register"
  ON decagon_registrations FOR INSERT TO anon WITH CHECK (true);

-- Allow reading registrations (used by the admin dashboard)
CREATE POLICY "anon can read registrations"
  ON decagon_registrations FOR SELECT TO anon USING (true);

-- Allow updating payment_status (used by the admin dashboard)
CREATE POLICY "anon can update status"
  ON decagon_registrations FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "anon can sign up for challenge"
  ON challenge_signups FOR INSERT TO anon WITH CHECK (true);

-- Allow reading challenge signups (used by the admin dashboard)
CREATE POLICY "anon can read signups"
  ON challenge_signups FOR SELECT TO anon USING (true);

-- Allow updating challenge signups (used by admin to set scores)
CREATE POLICY "anon can update signups"
  ON challenge_signups FOR UPDATE TO anon USING (true) WITH CHECK (true);

-- ── Score columns (run once if tables already exist) ──────────────────────────
-- If you created the tables before this update, run these ALTER statements:
--   ALTER TABLE decagon_registrations ADD COLUMN IF NOT EXISTS score INT DEFAULT 0;
--   ALTER TABLE challenge_signups     ADD COLUMN IF NOT EXISTS score INT DEFAULT 0;
--   ALTER TABLE challenge_signups     ADD COLUMN IF NOT EXISTS days_completed INT DEFAULT 0;

-- Allow anyone to upload receipts to the storage bucket
CREATE POLICY "anon can upload receipts"
  ON storage.objects FOR INSERT TO anon
  WITH CHECK (bucket_id = 'decagon-receipts');

-- Allow public read of receipts (so you can view them from the dashboard)
CREATE POLICY "public can view receipts"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'decagon-receipts');
