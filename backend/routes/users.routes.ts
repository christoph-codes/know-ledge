import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { supabase } from "../config/supabase.js";
import { User } from "@know-ledge/shared";

export default async function usersRoutes(fastify: FastifyInstance) {
  fastify.get(
    "/users",
    async (request: FastifyRequest, reply: FastifyReply) => {
      console.log("☕️ getting users");
      const users = await supabase.from("users").select("*");
      return reply.send(users.data);
    }
  );
  // CRITICAL: POST route requires authentication
  fastify.post(
    "/users",
    async (
      request: FastifyRequest<{ Body: { userDetails: User } }>,
      reply: FastifyReply
    ) => {
      console.log("📝 creating user");
      const userDetails = request.body.userDetails;

      const newUser = await supabase.from("users").insert([userDetails]);
      if (newUser.status !== 201) {
        console.log("error", newUser.error);
        throw new Error(newUser.error?.message ?? "Failed to create user");
      }
      return reply.send(newUser.statusText);
    }
  );

  fastify.get(
    "/users/:auth_id",
    async (request: FastifyRequest<{ Params: { auth_id: string } }>, reply) => {
      const auth_id = request.params.auth_id;

      const users = await supabase
        .from("users")
        .select("*")
        .eq("auth_id", auth_id)
        .single();
      if (users.error) {
        throw new Error(
          users.error?.message ?? "Failed to get user by auth_id"
        );
      }
      return reply.send(users.data as User);
    }
  );
}
