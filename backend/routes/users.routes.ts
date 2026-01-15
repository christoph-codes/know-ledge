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
  fastify.post(
    "/users",
    async (
      request: FastifyRequest<{ Body: { userDetails: User } }>,
      reply: FastifyReply
    ) => {
      console.log("📝 creating user");
      const { userDetails } = request.body;
      const newUser = await supabase.from("users").insert([userDetails]);
      if (newUser.status !== 201) {
        return reply.status(400).send({
          error: newUser.error ?? "Failed to create user",
        });
      }
      return reply.send(newUser.statusText);
    }
  );
  fastify.patch(
    "/users/:id",
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: { userDetails: Partial<User> };
      }>,
      reply: FastifyReply
    ) => {
      console.log("✏️ updating user");
      const { id } = request.params;
      const { userDetails } = request.body;
      const updatedUser = await supabase
        .from("users")
        .update(userDetails)
        .eq("id", id);
      return reply.send(updatedUser.data);
    }
  );
  fastify.delete(
    "/users/:id",
    async (
      request: FastifyRequest<{ Params: { id: string } }>,
      reply: FastifyReply
    ) => {
      console.log("🗑 deleting user");
      const { id } = request.params;
      const deletedUser = await supabase.from("users").delete().eq("id", id);
      return reply.send(deletedUser.statusText);
    }
  );
}
