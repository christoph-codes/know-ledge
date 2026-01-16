import { createSupabaseServerClient } from "../lib/supabase/server";

/**
 * CRITICAL: Helper to get the current user's auth token for backend API calls
 *
 * LEARNING: Why do we need this?
 * - Frontend (Next.js) has the user's session in cookies
 * - Backend (Fastify) needs the JWT token to verify the user
 * - This function extracts the JWT from the session to send to the backend
 *
 * When to use:
 * - Any server action that makes requests to your backend API
 * - Specifically for POST, PATCH, DELETE operations that require authentication
 */
export async function getAuthToken(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();

  // CRITICAL: Get the current session to extract the access token
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // LEARNING: The access_token is the JWT that backend will verify
  return session?.access_token ?? null;
}
