## Problem

The preview at `id-preview--…lovable.app` loads correctly (the SSR fix in `src/start.ts` is live), but the published site `https://replit-sparkle-forge.lovable.app/` is still serving the old broken build. Published deployments only update when "Publish" is clicked — they do not auto-track preview fixes. So even though the code is fixed, the live URL keeps showing the SSR error page until we redeploy.

A separate (smaller) issue is visible in the network log: `POST /assessment_users` returns 401 with `new row violates row-level security policy`. That blocks the "Begin Assessment" submit. It's unrelated to the page-load failure but worth fixing in the same pass so the published site is actually usable once redeployed.

## Plan

1. **Republish the site** so the fixed build (empty `functionMiddleware`, no SSR `localStorage` crash) replaces the broken deployment at `replit-sparkle-forge.lovable.app`. Expect ~1 minute for the new build to go live; a hard refresh (Ctrl/Cmd+Shift+R) clears any cached error page in Chrome/Edge.

2. **Fix the RLS block on `assessment_users` / `assessment_sessions` / `assessment_answers` / `assessment_results`** with a migration that allows anonymous inserts (the assessment is taken without login). Concretely: add `INSERT` (and the minimal `SELECT`/`UPDATE` needed by `saveResult`) policies `TO anon, authenticated`, plus a `GRANT INSERT … TO anon` on each table. RLS stays on; policies stay scoped to the assessment flow only.

3. **Run a security scan** after the migration and before publishing, to confirm no new critical findings (anon-writable tables are expected here because the product is an anonymous quiz — we'll document that in security memory if the scanner flags it).

4. **Verify** by loading `https://replit-sparkle-forge.lovable.app/` in a fresh tab and walking the start-assessment form end-to-end (submit should now navigate to `/assessment` instead of 401-ing).

## Technical details

- No app code changes required for step 1 — it's a redeploy of the already-fixed `src/start.ts`.
- Step 2 migration shape (one file under `supabase/migrations/`):
  - `CREATE POLICY "anon can insert" ON public.assessment_users FOR INSERT TO anon, authenticated WITH CHECK (true);`
  - same for `assessment_sessions` (insert + update own row by id), `assessment_answers` (insert/upsert), `assessment_results` (insert).
  - `GRANT INSERT ON public.assessment_users TO anon;` and equivalents per table. Keep `service_role` with `ALL`.
- No changes to `src/integrations/supabase/client.ts`, `start.ts`, `server.ts`, or `__root.tsx`.

## Out of scope

- Auth/login for the assessment (the product is intentionally anonymous).
- Custom domain setup.
- Touching the SSR wrapper / error page — those are working.
