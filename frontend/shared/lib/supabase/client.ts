import { createBrowserClient } from "@supabase/ssr";

/**
 * CRITICAL: Client-side Supabase client for Client Components
 *
 * Why use createBrowserClient?
 * - Automatically manages cookies in the browser
 * - Handles session refresh automatically
 * - Works with React Client Components
 *
 * LEARNING: Use this only in Client Components (files with "use client" directive).
 * For Server Components and Server Actions, use createSupabaseServerClient instead.
 *
 * The browser client is primarily used for:
 * - Real-time subscriptions
 * - Client-side auth state changes
 * - Any client-side operations (rare in this app since we prefer server-side)
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
