## Plan

Fix the SSR crash without rebuilding the app. The error is:

```text
ReferenceError: localStorage is not defined
  at src/integrations/supabase/client.ts:41
  from src/integrations/supabase/auth-attacher.ts
  from src/start.ts
```

`src/start.ts` still imports `attachSupabaseAuth`, which pulls the browser Supabase client into the SSR entry and crashes on `localStorage`.

### Steps

1. **Edit `src/start.ts`**
   - Remove `import { attachSupabaseAuth } from "@/integrations/supabase/auth-attacher"`.
   - Set `functionMiddleware: []` so no server-function middleware is registered.
   - Keep `requestMiddleware: [errorMiddleware]` intact.

2. **Leave generated files untouched**
   - Do not modify `src/integrations/supabase/client.ts` or `auth-attacher.ts` (auto-generated).
   - No other files need to change.

3. **Verify the fix**
   - Reload the preview and confirm the `localStorage is not defined` runtime error is gone and pages render.
   - Check dev-server logs if anything still fails.

4. **Publish once preview is stable** so `https://replit-sparkle-forge.lovable.app` serves the fixed build.

### Note

If any server function later needs an authenticated Supabase call, we'll add a small custom `functionMiddleware` that reads the token via `typeof window !== "undefined"` guards — never the generated `attachSupabaseAuth`, which touches `localStorage` at module scope.