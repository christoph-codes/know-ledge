import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { supabase } from "../config/supabase.js";
import { Tag } from "@know-ledge/shared";

export default async function tagsRoutes(fastify: FastifyInstance) {
  fastify.get("/tags", async (request: FastifyRequest, reply: FastifyReply) => {
    console.log("☕️ getting tags");
    const tags = await supabase.from("tags").select("*");
    return reply.send(tags.data as Tag[]);
  });
}
