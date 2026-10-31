# Dashboard stability & cleanup

## Short answer on "detaching the dashboard"

The dashboard is already visually detached: `__root.tsx` skips the public header/footer/WhatsApp/audio for any `/dashboard*` path, and `dashboard.tsx` renders its own shell with `ssr: false`. Splitting it into a separate app (own subdomain/project) would not fix the current bugs — those come from inside the dashboard code, not from the website wrapper — and it would cost you a duplicated auth setup, duplicated backend client, and a second deploy to maintain. Recommendation: keep one app, and instead harden the boundary that already exists (details below). If you later want `hub.meltawaysspa.com`, that can be done as a domain alias without splitting the codebase.

## What's actually causing the bugginess

Confirmed by reading the code:

1. **Stale data after saves — mismatched cache keys.** Several screens save successfully but the list doesn't update, because the refresh call targets a key nobody uses:
   - Appointment detail and consultations refresh `["appointments"]`, but the list reads `["appointments-list-v2"]`.
   - Consultations refresh `["consultations-page"]`; the shared table hook reads `["consultations","all"]`.
   - Customer profile refreshes `["customer", id]`, but the data is stored under `["customers", id]`.
   - Sales/payments refresh `["dashboard"]` but not `["customer_sales", id]`, so a customer's sales tab stays old.
2. **Duplicate/competing data layers.** The same entities are fetched three different ways — `dashboard-queries.ts`, `dashboard-tables.ts`, and inline queries inside `AppointmentsPage.tsx` (583 lines) and `ConsultationsPage.tsx` (691 lines). Same data, different keys, different shapes, so one screen updates and another doesn't.
3. **Orphaned routes.** `/dashboard/therapists` and `/dashboard/settings` were removed from the sidebar but the pages still exist and are reachable by URL; `therapists` overlaps with the Accounts (employees) page.
4. **Fragile mobile shell.** `dashboard.tsx` gates rendering on a session plus a 4s MFA timeout, and `__root.tsx` double-checks the path via `window.location` — on slow mobile networks this can leave the "Loading dashboard…" state or flash public chrome.
5. **No error surfacing.** Failed mutations are silent in several places (no toast), so a blocked write looks like "the button does nothing".

## Plan

**Step 1 — Unify cache keys (biggest win).**
Create one `src/lib/query-keys.ts` with canonical keys (appointments, appointment detail, consultations, customers, customer sub-tabs, invoices, services, employees, dashboard). Replace every literal key string in `dashboard-queries.ts`, `dashboard-tables.ts`, `sales.ts`, `appointments-detail.ts`, `AppointmentsPage.tsx`, `ConsultationsPage.tsx`, and the dashboard route files. After each mutation, invalidate the entity prefix plus `dashboard`, so lists, detail views, and the homepage KPIs all refresh together.

**Step 2 — Remove redundancy.**
Delete `dashboard.therapists.tsx` and `dashboard.settings.tsx` (Accounts already covers staff). Remove duplicate fetch helpers left over after Step 1 so each entity has exactly one read hook.

**Step 3 — Consistent write feedback.**
Add a shared mutation wrapper that shows a success toast and, on failure, an error toast with the backend message. Apply to every create/update/delete on appointments, consultations, customers, invoices/payments, services, and accounts, and disable buttons while a save is in flight so double-taps can't fire twice.

**Step 4 — Harden the dashboard shell.**
Simplify the `__root.tsx` dashboard check to the router pathname only (drop the `window.location` duplicate). In `dashboard.tsx`, stop blocking render on the MFA check (run it in the background), and show a clear "Couldn't load — retry" state instead of an indefinite "Loading dashboard…".

**Step 5 — Verify.**
Walk the full journey in a headless browser signed in as staff: create a consultation → convert to customer → book an appointment → mark done → create invoice → add payment → confirm the homepage KPIs, customer profile tabs, and sales list all reflect it without a manual refresh. Capture screenshots at desktop and mobile widths.

## Technical notes

- No schema/migration changes; this is client-side data-layer and UI work.
- No change to the public website's look or behaviour.
- Files touched: `src/lib/query-keys.ts` (new), `dashboard-queries.ts`, `dashboard-tables.ts`, `sales.ts`, `appointments-detail.ts`, `src/pages/AppointmentsPage.tsx`, `src/pages/ConsultationsPage.tsx`, dashboard route files, `src/routes/__root.tsx`, `src/routes/dashboard.tsx`.
