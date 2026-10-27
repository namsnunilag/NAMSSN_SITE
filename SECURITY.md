# Security Operations

## Current protection boundary

The site is a static Vite application. Values prefixed `VITE_` are bundled into browser JavaScript and must never contain privileged credentials. The Supabase anon/publishable key is public by design; table and storage access must be enforced by RLS and storage policies. Never put a Supabase service-role/secret key in this repository or in a `VITE_*` variable.

Legacy Decagon, giveaway, attendance, and jersey routes are redirected to `/events`. Their browser write flows are not available to visitors. Do not re-enable them until a server-validated, rate-limited Edge Function or equivalent backend is deployed.

## Required Supabase rollout

The source changes do not alter a remote Supabase project. Before publishing the hardened frontend:

1. Take a database backup and review the target project/ref.
2. Run `supabase/migrations/20261019000000_harden_legacy_surfaces.sql` in the target project's SQL Editor. This drops old anonymous policies on the named legacy tables, revokes anonymous data access, restricts leaderboard fields, privatizes the receipt bucket, disables the giveaway RPC, and installs admin-only RLS policies and audit triggers.
3. Confirm the `decagon-receipts` bucket is private and that anonymous requests cannot select, update, or delete private rows or download receipts. Anonymous leaderboard reads should return only the explicitly granted display columns.
4. Create the intended admin user through Supabase Auth with a verified email. Using a privileged project-owner SQL session, assign the trusted app metadata claim to that exact user:

   ```sql
   UPDATE auth.users
   SET raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb)
     || '{"role":"admin"}'::jsonb
   WHERE email = 'admin@example.com';
   ```

   Check that exactly one row was updated. Do not set this value through client-editable `user_metadata`. Sign in again after the claim change so the access token contains the new claim.
5. Deploy the frontend, sign in at `/admin`, and verify a non-admin account is denied. Verify receipt links work for admins and expire. Keep the previous deployment available for rollback, but do not roll back to an app/database combination with the old anonymous policies.

This migration intentionally closes legacy anonymous submissions. Do not restore anonymous table inserts or public receipt access to make those forms work. Implement and test a server-side submission function with input validation, upload restrictions, request-size limits, rate limiting, and transactional capacity allocation before reopening any registration workflow.

## Credential response

- Check Git history and deployment settings for any Supabase service-role/secret key, admin password, EmailJS private token, or other privileged credential. The anon/publishable key is not a privileged secret.
- If a privileged key was ever committed, pasted publicly, or included in a deployed bundle, rotate it in the provider dashboard. Removing it from the latest source does not remove it from history or old builds.
- Keep local values in ignored `.env.local`/`.env.*` files and deployment secrets. Only `.env.example` may be committed, with blank placeholders.
- Enable Supabase Auth MFA for admins, restrict admin account creation/invites, and review Auth and database logs after rollout.

Reauditing Success?

## Verification limits

A successful local `npm run build` proves only that the frontend compiles. It does not prove the migration ran, that RLS is correct on the live project, that the hosting provider serves the configured headers, or that rate limiting exists. Record separate verification for the database, storage, admin/non-admin access, and Netlify/Vercel response headers before calling production secure.
