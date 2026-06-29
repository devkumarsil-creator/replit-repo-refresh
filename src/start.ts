import { createStart, createMiddleware } from "@tanstack/react-start";

import { renderErrorPage } from "./lib/error-page";

// NOTE: The generated `attachSupabaseAuth` middleware is intentionally NOT
// registered here. It imports the browser Supabase client at module scope,
// which touches `localStorage` during SSR and crashes the server entry.
// This app has no server functions that use `requireSupabaseAuth`, so no
// bearer middleware is needed. If you add one later, write a project-specific
// `functionMiddleware` that reads the session lazily inside the .client()
// handler instead of re-adding the generated attacher.

const errorMiddleware = createMiddleware().server(async ({ next }) => {
  try {
    return await next();
  } catch (error) {
    if (error != null && typeof error === "object" && "statusCode" in error) {
      throw error;
    }
    console.error(error);
    return new Response(renderErrorPage(), {
      status: 500,
      headers: { "content-type": "text/html; charset=utf-8" },
    });
  }
});

export const startInstance = createStart(() => ({
  functionMiddleware: [],
  requestMiddleware: [errorMiddleware],
}));
