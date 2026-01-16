import { getAuthToken } from "../server/getAuthToken";

const baseUrl = process.env.NEXT_PUBLIC_RENDER_URL || "";

/**
 * CRITICAL: Fetch wrapper that automatically includes authentication
 *
 * LEARNING: This function:
 * 1. Gets the user's JWT token from their Supabase session
 * 2. Adds it to the Authorization header
 * 3. Sends it to your backend (Fastify)
 * 4. Backend verifies the token before allowing write operations
 *
 * Why this pattern?
 * - Centralizes auth token handling (DRY principle)
 * - Every API call automatically includes authentication
 * - No need to manually add auth headers in every server action
 *
 * @param {string} path - The API endpoint path (e.g., "/resources")
 * @param {RequestInit} options - Fetch options (method, body, headers, etc.)
 */
const fetchRender = async (path: string, options?: RequestInit) => {
  // CRITICAL: Get the auth token for authenticated requests
  // LEARNING: This only runs server-side, so it's secure
  const token = await getAuthToken();

  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
  };

  // LEARNING: Add the JWT token to Authorization header if available
  // Backend middleware will verify this token before processing the request
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers,
  });

  // Check if the response is JSON before parsing
  const contentType = response.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return response.json();
  }
};

export default fetchRender;
