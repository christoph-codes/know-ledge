import { SupabaseClient } from "@supabase/supabase-js";

/**
 * CRITICAL: Extend Fastify types to include authenticated user information
 *
 * LEARNING: TypeScript module augmentation allows us to add custom properties
 * to Fastify's request object. This gives us type-safe access to the authenticated
 * user in all route handlers.
 */
declare module "fastify" {
  interface FastifyInstance {
    supabase: SupabaseClient;
  }

  interface FastifyRequest {
    // LEARNING: After authentication middleware runs, this will contain
    // the authenticated user's information from the JWT token
    user?: {
      id: string;
      email: string;
      role?: string;
    };
  }
}
