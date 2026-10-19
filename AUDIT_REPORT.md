# NAMSSN UNILAG Website — Comprehensive Read-Only Audit

Audit date: 17 October 2026

Scope: application code, Supabase schema and policies, forms, content, deployment configuration, dependencies, Git history, and collaboration safeguards.

No application refactor, deployment, database change, commit, or push was performed during this audit.

## Remediation status checked 19 October 2026

This status supplements the read-only findings below; it does not certify the live deployment or assign a numeric security score. A percentage such as 95% is not defensible until live database, storage, authentication, host headers, rate limits, and monitoring are independently verified.

- **Admin auth:** the browser password and fallback were removed. `/admin` now signs in through Supabase Auth and requires the trusted `app_metadata.role = admin` claim. Dashboard REST operations use that access token; receipt links are signed for one hour. This depends on applying the database migration and provisioning an admin account as documented in `SECURITY.md`.
- **RLS and receipts:** the bootstrap SQL and a dated migration remove old anonymous read/write policies on legacy registration/order tables, leave anonymous access closed on these tables, privatize the receipts bucket, and add admin-only policies and change audit triggers. These changes have **not** been applied or tested against the live Supabase project.
- **Public write surfaces:** old Decagon, giveaway, attendance, and jersey routes now redirect to Events. Anonymous writes are intentionally closed until a server-validated, rate-limited replacement is deployed. This reduces abuse exposure but disables those legacy workflows.
- **Secrets:** `.env` and `.env.*` are ignored with `.env.example` explicitly allowed. No service-role key or real browser admin password was found in tracked files. The Supabase anon key is public configuration, not a secret; rotate any service-role or provider secret if it was ever exposed outside ignored local files.
- **Hosting headers:** Netlify and Vercel config now sets `nosniff`, `DENY` framing, a strict-origin referrer policy, and disables unused device APIs. Deployment response headers have not been remotely verified.
- **Dependencies and automation:** the original audit found 18 npm advisories (11 high, 5 moderate, 2 low). A non-major npm fix was attempted but skipped; those findings remain open. Dependabot checks are configured, but no build/security CI workflow was added or verified.
- **Validation:** the Vite production build passes locally. SQL was not executed because no Supabase CLI/project connection is configured here; live RLS, storage privacy, admin login, and hosting headers remain unverified.

## How developers can run and view the project

Requirements: Git, Node.js 18 or newer, and npm. From PowerShell, clone the repository and enter the project folder:

```powershell
git clone https://github.com/namsnunilag/NAMSSN_SITE.git
Set-Location .\NAMSSN_SITE
npm ci
```

Create a local environment file. Do not commit it, upload it, or paste its values into chat:

```powershell
Copy-Item .env.example .env.local
code .env.local
```

Fill in the local Supabase and email-provider values in `.env.local`. The tracked `.env.example` intentionally contains blank placeholders. Then start the development server:

```powershell
npm run dev -- --host 127.0.0.1
```

Open the URL printed by Vite, normally `http://127.0.0.1:5173/`. If Windows file watching reports an `EBUSY` error for a file under `new_resources`, use polling:

```powershell
$env:CHOKIDAR_USEPOLLING = "true"
npm run dev -- --host 127.0.0.1
```

Useful validation commands:

```powershell
npm run build
npm run preview -- --host 127.0.0.1
git diff --check
git status --short --ignored
```

The preview server is for checking the production build locally; it does not publish the site. Before committing, stage named files instead of using `git add .`, review `git diff --cached`, run the build, and confirm that `.env.local`, `Secretfile`, `node_modules`, `dist`, and unrelated folders are not staged.

## Domain and backend status checked 17 October 2026

- `https://namssn-unilag.netlify.app` responded with the NAMSSN site title.
- `https://namssn-unilag.vercel.app` responded with the NAMSSN site title.
- `https://nammsnunilag.one` did not resolve from the current environment. This is a DNS/hosting-access issue to investigate; it is not proof that the domain or account is permanently lost.
- The local source currently uses the Supabase project configured in `.env.local`. The SQL file still defines the older Decagon, challenge, merchandise, attendance, receipt-storage, and Dean’s Games jersey tables. A fresh Supabase project will not contain those tables or policies until the setup is run there, and old data will not be present.
- The Contact page currently opens a prefilled `mailto:` draft; it does not submit to a server. The retired Decagon event notification component still contains Formspree placeholder IDs in source, but the old event submission routes are no longer mounted.
- Admin and ticket-related notifications still depend on EmailJS environment values. Missing values will affect those actions even if the public pages load.
- The Supabase anon URL/key are browser configuration values, not admin secrets. The current RLS policies remain unsafe for production because they allow anonymous reads and changes to sensitive records; do not treat the new project as secure merely because it is fresh.

## Executive summary

The application builds successfully, but it is not safe to treat the current admin and Supabase setup as production-secure. The highest-risk issue is that anonymous browser clients are granted broad read, update, and delete access to registration and order data; the `/admin` password does not provide real authorization because it is checked in the browser. Payment receipts are also publicly readable.

The site has a useful feature set and a working Vite build, but it contains stale event/content information, placeholder form endpoints, broken or missing image references, race conditions around attendance capacity/freebies, inconsistent validation, and no automated CI, tests, linting, secret scanning, or dependency policy. Dependency audit results include 18 findings: 11 high, 5 moderate, and 2 low. Most are build-tool/transitive issues, but the direct Vite, Tailwind, PostCSS, React Router, and KaTeX versions need a planned upgrade.

## Priority order

1. Lock down Supabase RLS and storage; remove anonymous reads, updates, and deletes of personal/order data.
2. Replace client-side admin password protection with Supabase Auth or a server-side admin API.
3. Make receipts private and issue short-lived signed URLs only to authorized admins.
4. Replace placeholder Formspree endpoints and move the endpoint into deployment configuration.
5. Add server-side validation, rate limiting, and transactional capacity/freebie allocation.
6. Establish CI, protected main branch, dependency scanning, secret scanning, and reproducible Node tooling.
7. Run a content and link refresh for the 2026/2027 session.

## Security findings — 17 October baseline

The findings below describe the pre-remediation state. Use the 19 October remediation status above for current repository changes; production status remains unverified until the remote migration and hosting configuration are checked.

### 🔴 CRITICAL — Anonymous users can read and modify private records

Evidence: `supabase-setup.sql:40-61`, `supabase-setup.sql:79-137`; browser access in `src/pages/Admin.jsx:21-22`.

The `anon` role can select and update registrations, challenge signups, merchandise orders, attendance, and jersey orders. Anyone can discover the public Supabase URL/key in the browser and call the REST API directly, bypassing the UI.

Potential impact: disclosure of names, email addresses, phone numbers, matric numbers, departments, scores, payment states, ticket data, and order information; fraudulent score/status changes; deletion where delete policies exist.

Fix: public policies should generally allow only the minimum required insert operation. Administrative reads/updates/deletes should require authenticated admin users or a trusted server/Edge Function. Add column-level and row-level authorization, audit logging, and rate limits.

### 🔴 CRITICAL — `/admin` authentication is client-side

Evidence: `src/pages/Admin.jsx:14-15`, `src/pages/Admin.jsx:320-328`, `src/pages/Admin.jsx:1526-1529`.

The password is bundled into the client, includes a fallback value, and the login state is only a `sessionStorage` flag. A user can inspect the bundle, set the storage value manually, or call the Supabase endpoints without visiting `/admin`.

Fix: use Supabase Auth with an admin role claim or a server-side session. Enforce authorization at the database/API layer on every operation. Remove the fallback password and do not use `VITE_*` variables for secrets.

### 🔴 CRITICAL — Payment receipts are publicly readable

Evidence: `supabase-setup.sql:145-150`; public URL construction in `src/pages/Decagon.jsx:57` and `src/pages/DeansGamesJersey.jsx:40`.

The storage bucket is public and the policy allows public reads. Receipts can contain names, account details, transaction references, and other sensitive information.

Fix: make the bucket private, validate MIME type and size server-side, use unpredictable object names, and generate short-lived signed URLs only after authorization.

### 🟠 HIGH — Capacity and freebie allocation can be bypassed by concurrent submissions

Evidence: `src/pages/DecagonAttend.jsx:103-136`.

The browser reads a count, decides whether a freebie is available, then inserts independently. There is no transaction or database function enforcing the 150-person capacity and 50-freebie limit.

Fix: perform allocation in a database function or trusted API transaction with locking/constraints and return the authoritative ticket/freebie result.

### 🟠 HIGH — Unbounded anonymous uploads and public data-entry endpoints

Evidence: `supabase-setup.sql:39-42`, `supabase-setup.sql:145-150`, upload code in `src/pages/Decagon.jsx:34-58` and `src/pages/DeansGamesJersey.jsx:17-42`.

Client checks can be bypassed. Attackers can submit arbitrary volume, upload unexpected content types, consume storage, and create spam records.

Fix: validate server-side, restrict allowed MIME types and extensions, cap request sizes, randomize object names, add rate limiting/CAPTCHA where appropriate, and monitor storage usage.

### 🟠 HIGH — Giveaway integrity relies on client-controlled flow

Evidence: `src/pages/Giveaway.jsx:54-64`, `src/pages/Giveaway.jsx:72-111`.

The question and answer are shipped to the browser and the eligibility check is client-side before calling the RPC. The RPC is safer only if its own function and table permissions enforce all rules; that could not be proven from the local SQL file because the giveaway schema/function is absent.

Fix: issue server-side challenges or validate the answer entirely inside a protected database function. Confirm the function is not executable by arbitrary roles beyond the intended public entry path.

### 🟡 MEDIUM — Ticket IDs use predictable client-side randomness

Evidence: `src/pages/DecagonAttend.jsx:118`.

`Math.random()` is not authoritative and can collide or be guessed.

Fix: generate IDs using a database UUID/sequence or a server-side cryptographic generator.

### 🟡 MEDIUM — Error states can falsely show availability

Evidence: `src/pages/DecagonAttend.jsx:117`.

The attendee-count request suppresses all errors and leaves the count at zero, making the UI appear to have maximum capacity when the backend is unavailable.

Fix: show an explicit unavailable state and block or qualify registration until capacity can be verified.

### 🟡 MEDIUM — No proven rate limiting, abuse prevention, or audit trail

Evidence: public insert policies in `supabase-setup.sql:39-42`, `52-61`, `79-87`, `104-105`, `126-137`.

There is no local evidence of rate limits, CAPTCHA, abuse monitoring, or immutable admin audit logs.

Fix: add edge/API rate limits, validation, duplicate controls, monitoring, and audit records for status/score/delete actions.

## Functional and data-quality findings

### 🟠 HIGH — Placeholder Formspree endpoints are still present

Evidence: `src/pages/EventDetail.jsx:65` and `src/pages/EventDetail.jsx:150`.

The event notification forms submit to `https://formspree.io/f/YOUR_FORM_ID`, so those forms cannot work. The contact form has a separate hardcoded endpoint in `src/pages/Contact.jsx:55`.

Fix: replace all placeholders when the new Formspree account is supplied, configure the endpoint through deployment environment variables, and test success, validation failure, network failure, and duplicate submissions.

### 🟠 HIGH — Broken event image paths

Evidence: `src/data/events.js:13` references `/images/events/decagon5.jpg`; `src/data/events.js:78` references `/images/events/deans.jpg`. These files were not found in the public asset tree. Related hero paths in `src/pages/Home.jsx` and `src/pages/About.jsx` also need an asset existence check.

Fix: add the assets, correct paths, or use deliberate local fallback artwork.

### 🟠 HIGH — Event lifecycle and promotional content are stale

Evidence: `src/data/events.js:5-24`, `src/data/events.js:92`, `src/pages/Events.jsx`, `src/pages/DecagonAttend.jsx`.

The October 2026 site still contains May/June 2026 promotional copy, “competition underway” wording, an empty upcoming-event list, and a `TBA` event time. Decagon and Dean’s Games pages may lead visitors to expired workflows.

Fix: add explicit event status and archival fields, derive event sections from dates, remove/close expired forms, and refresh announcements after each event.

### 🟡 MEDIUM — Academic page promises content that is empty or stale

Evidence: `src/pages/Academics.jsx:37`; `src/data/academics.js:5-30`.

Past questions, timetable fields, and some links are empty, while the visible announcement is from January 2026.

Fix: populate the promised content or change the copy; show last-updated dates and assign an owner for content maintenance.

### 🟡 MEDIUM — Community articles contain empty image fields

Evidence: multiple entries in `src/data/community.js`; rendering in `src/pages/Community.jsx:35-36`.

Empty image strings can produce broken/empty image requests and inconsistent cards.

Fix: use a shared fallback or omit the image element when no image exists.

### 🟡 MEDIUM — Contact metadata is inconsistent

Evidence: `index.html:53-54` uses `namssn.unilag@gmail.com`; `src/components/Footer.jsx:93` and `src/pages/Contact.jsx:18-21` use `namsnunilag9@gmail.com`.

Fix: centralize organization name, email, phone, address, social links, and canonical URL in one configuration module.

### 🟡 MEDIUM — Home and event content disagree

Evidence: `src/pages/Home.jsx:12` labels Dean’s Games as 2025 while `src/data/events.js:73` labels it 2026.

Fix: use one source of truth for event metadata.

## Accessibility and UX findings

### 🟡 MEDIUM — Custom form labels are not explicitly associated

Evidence: `src/pages/DecagonAttend.jsx:33-43`, `src/pages/DeansGamesJersey.jsx:61-73`, and the file input around `src/pages/DeansGamesJersey.jsx:121-140`.

Labels do not consistently have matching `htmlFor`/`id` pairs.

Fix: generate stable IDs and associate labels, inputs, selects, and file controls. Add screen-reader status messages for submission errors and success.

### 🟡 MEDIUM — Validation is inconsistent and mostly client-side

Evidence: `src/pages/Contact.jsx:42-48`, `src/pages/Contact.jsx:115`, and custom registration forms.

Malformed email/phone values, oversized or incorrect files, invalid enum values, and out-of-range numbers can be sent directly to the API.

Fix: use shared schemas on both client and server, enforce database constraints, and return field-level errors.

### 🟡 MEDIUM — Clipboard success can be falsely reported

Evidence: `src/pages/DeansGamesJersey.jsx:80-87`.

Clipboard failures are not awaited or caught.

Fix: await the promise and show an accessible failure message or manual-copy fallback.

### ⚪ LOW — Error and loading states are inconsistent

Several pages use silent catches or generic errors. Standardize an error boundary, request helper, retry behavior, and user-facing status messaging.

## Dependency findings

`npm audit --json` reported 18 findings across 183 dependencies:

- 11 high
- 5 moderate
- 2 low
- 0 critical

Notable affected packages include direct or transitive versions of Vite, Tailwind CSS, PostCSS, React Router, KaTeX, esbuild, browserslist, source-map-js, micromatch, picomatch, braces, chokidar, nanoid, and postcss-selector-parser.

Important context: most findings affect development/build tooling rather than the deployed static runtime, but they still matter for developer-machine and CI security. Do not run `npm audit fix --force` blindly. Create a dependency upgrade branch, update in compatible groups, run the build, and inspect the resulting lockfile.

Recommended order:

1. Patch non-breaking transitive/direct versions where possible.
2. Upgrade React Router to a fixed compatible release.
3. Upgrade Vite/esbuild/PostCSS and validate Netlify/Vercel builds.
4. Plan Tailwind 4 and React 19 as separate migrations.
5. Upgrade KaTeX and test all rendered mathematics.

## Performance findings and opportunities

- The app uses lazy routes, which is good, but large page/data modules and image assets should be measured with a production bundle report.
- Add responsive image variants, explicit dimensions, modern formats, and lazy loading below the fold.
- Avoid fetching full tables with `select=*`; use selected columns and pagination, especially in admin views.
- Move admin operations out of the public browser bundle and load admin-only code only after authenticated access.
- Add caching headers for immutable assets and verify compression/CDN behavior.
- Use a real performance budget for JavaScript, largest image, LCP, and route load time.
- Avoid silent failed requests that trigger repeated retries or misleading rendering.

## Git, attribution, and collaboration findings

Repository state at audit time:

- `main` tracks `origin/main`.
- No additional branches or tags were evidenced locally.
- The worktree has an uncommitted `.env.example` change.
- `.env.local`, `node_modules`, and `dist` are ignored.
- No project-owned GitHub Actions workflow was found.
- No lint or test scripts exist; `package.json` only defines dev, build, and preview.
- Node/npm versions are not pinned in Netlify configuration.
- No local evidence of branch protection, required checks, or signed commits.

Historical attribution is not fully normalized:

- `Dhapor`, `Oludare Samuel`, and `Oludare Samuel Oladapo` appear to represent related identities.
- `Certifieddonnie` has two recent commits, including generic subjects such as `variables`.
- GitHub Copilot has agent-session commits.
- Some author and committer identities differ.
- Commits are not consistently signed.

Accurate change tracking should use:

1. Protected `main` with pull requests and required build/security checks.
2. One branch per task or issue.
3. Conventional commit messages describing intent and affected area.
4. Verified GitHub identities or a reviewed `.mailmap`.
5. Pull-request authorship and review metadata as the source of truth for who changed what.
6. A CI-generated build, dependency, secret, and link check before merge.

## Commit/change attribution available from local history

The local history contains 195 commits from 7 March through 17 October 2026. The latest commits include:

- `f9c026b` — `variables`, by Certifieddonnie.
- `7e2b12c` and `7da38e5` — Copilot agent-session/checkpoint commits.
- Earlier feature work by Dhapor/Oludare identities covering the admin dashboard, Decagon workflows, attendance, jersey orders, EmailJS notifications, gallery, events, and SEO.

The local Git metadata can accurately describe commit subjects, authors, committers, timestamps, and changed files, but it cannot prove which human made an action when accounts or identities are shared. GitHub audit logs, pull requests, branch protection, and verified identities are needed for authoritative attribution.

## Suggested remediation phases

### Phase 0 — Freeze risky operations

Do not publish new admin functionality or collect more sensitive payment data until RLS, storage privacy, and admin authorization are fixed. Rotate any credential that may have been exposed in a public repository or build.

### Phase 1 — Secure data and admin

Use Supabase Auth/roles or an Edge Function, tighten RLS, privatize storage, add signed URLs, add server-side validation, and add audit logs.

### Phase 2 — Restore form reliability

Replace the placeholder Formspree endpoints, move configuration to deployment secrets, test every form, and add rate limiting/spam protection.

### Phase 3 — Correct content and UX

Refresh dates, event states, contact details, images, academic resources, announcements, newsletters, social links, metadata, and accessibility labels.

### Phase 4 — Engineering controls

Add CI, linting, unit/component tests, link checking, dependency scanning, secret scanning, preview deployments, protected branches, and pinned Node/npm versions.

### Phase 5 — Performance and monitoring

Measure Core Web Vitals and bundle size, optimize media and queries, add error monitoring, and create a content/data update checklist.

## Verification checklist before the next production publish

- [ ] No sensitive values in tracked files, build artifacts, or logs.
- [ ] RLS tests prove anonymous users cannot read/update/delete private records.
- [ ] Admin operations require real authorization.
- [ ] Receipts are private and signed URLs expire.
- [ ] All Formspree endpoints are real and tested.
- [ ] Registration capacity/freebies are transactionally enforced.
- [ ] Invalid uploads and oversized payloads are rejected server-side.
- [ ] Events, dates, contacts, images, and announcements are current.
- [ ] `npm ci`, build, lint, tests, dependency scan, secret scan, and link check pass.
- [ ] Pull request reviewed by another contributor before merging to protected `main`.
