import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * CRITICAL: Server-side Supabase client for Next.js Server Components and Server Actions
 *
 * Why use createServerClient instead of createClient?
 * - Automatically handles cookie-based sessions (more secure than localStorage)
 * - Works with Next.js Server Components (RSC) and Server Actions
 * - Provides proper cookie management with get/set/remove handlers
 *
 * LEARNING: Always use this pattern for server-side auth in Next.js App Router.
 * Never use the basic createClient on the server - it won't properly manage sessions.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // CRITICAL: Cookie handlers allow Supabase to read/write session cookies
        // This enables automatic session management across requests
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // LEARNING: The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing sessions.
            // We'll handle this in middleware for better session management.
          }
        },
      },
    }
  );
}
