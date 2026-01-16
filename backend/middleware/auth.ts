import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import { createClient } from "@supabase/supabase-js";

/**
 * CRITICAL: Authentication middleware for Fastify
 *
 * This middleware:
 * 1. Extracts the JWT token from the Authorization header
 * 2. Verifies the token with Supabase
 * 3. Attaches user information to the request object
 * 4. Blocks unauthorized requests
 *
 * LEARNING: How Supabase Auth works with a separate backend:
 * - Frontend gets a JWT token when user logs in
 * - Frontend sends this token in Authorization header: "Bearer <token>"
 * - Backend verifies the token with Supabase to ensure it's valid
 * - If valid, we know the user is authenticated and can trust the user ID
 *
 * Why verify on the backend?
 * - Never trust data from the frontend alone
 * - JWT verification ensures the token hasn't been tampered with
 * - Supabase's getUser() checks if the token is still valid (not expired/revoked)
 */
export async function authenticateRequest(
  request: FastifyRequest,
  reply: FastifyReply,
  done: HookHandlerDoneFunction
) {
  try {
    // CRITICAL: Extract the Authorization header
    // Expected format: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    const authHeader = request.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return reply.code(401).send({
        error: "Unauthorized",
        message: "Missing or invalid authorization header",
      });
    }

    // Extract the token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // CRITICAL: Create a Supabase client to verify the token
    // LEARNING: We create a fresh client here because we need to set the auth token
    // The global supabase client doesn't have the user's token
    const supabase = createClient(
      process.env.SUPABASE_PROJECT_URL!,
      process.env.SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      }
    );

    // CRITICAL: Verify the token and get user information
    // LEARNING: getUser() does two things:
    // 1. Verifies the JWT signature (ensures token is valid and not tampered with)
    // 2. Checks if the user still exists in Supabase (token not revoked)
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return reply.code(401).send({
        error: "Unauthorized",
        message: "Invalid or expired token",
      });
    }

    // LEARNING: Attach user to request for use in route handlers
    // Now any route can access request.user to get the authenticated user
    request.user = {
      id: user.id,
      email: user.email!,
      role: user.role,
    };

    // Continue to the route handler
    done();
  } catch (error) {
    request.log.error(error, "Authentication error");
    return reply.code(500).send({
      error: "Internal Server Error",
      message: "Authentication failed",
    });
  }
}

/**
 * OPTIONAL: Helper to create an authenticated route
 *
 * LEARNING: This is a convenience wrapper that makes it explicit
 * which routes require authentication. Use like:
 *
 * fastify.post('/resources', { preHandler: requireAuth }, async (request, reply) => {
 *   const userId = request.user!.id; // TypeScript knows user exists
 * });
 */
export const requireAuth = authenticateRequest;
