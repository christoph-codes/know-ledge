import { Resource, RESOURCE_TYPES } from "@know-ledge/shared";
import { FastifyInstance, FastifyRequest } from "fastify";
import { supabase } from "../config/supabase.js";
import { createTags, getResources } from "../services/resources.service.js";

export default async function resourcesRoutes(fastify: FastifyInstance) {
  fastify.get("/resources", async (_request, reply) => {
    fastify.log.info("☕️ getting resources");
    const { userId, tags, searchTerm, resourceTypes } = _request.query as {
      userId?: string;
      tags?: string;
      searchTerm?: string;
      resourceTypes?: string;
    };
    const parsedTags = tags && JSON.parse(tags);
    const parsedTypes = resourceTypes ? JSON.parse(resourceTypes) : undefined;
    try {
      const { data, error } = await getResources({
        userId,
        tags: parsedTags,
        searchTerm,
        resourceTypes: parsedTypes,
      });

      if (error) {
        fastify.log.error(
          {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          },
          "Supabase /resources query failed"
        );
        return reply.code(500).send({ error: error.message, code: error.code });
      }

      fastify.log.info(data);

      const resources = (data ?? []).map((r: any) => {
        const tags = (r.resource_tags ?? [])
          .map((rt: any) => rt.tags)
          .filter(Boolean);

        // return full resource + tags, but remove join rows to avoid redundancy
        const { resource_tags, ...resource } = r;
        return { ...resource, tags };
      });

      return reply.send(resources);
    } catch (err: any) {
      fastify.log.error({ err }, "Unhandled /resources error");
      return reply.code(500).send({ error: "Server error" });
    }
  });

  fastify.post(
    "/resources",
    async (
      request: FastifyRequest<{
        Body: { payload: { resource: Partial<Resource>; tags?: string[] } };
      }>,
      reply
    ) => {
      try {
        fastify.log.info("📝 creating resource");
        const { resource, tags = [] } = request.body.payload;

        if (!resource.title || resource.type === undefined) {
          fastify.log.error(
            "Resource title and type are required to create a resource"
          );
          return reply.status(400).send({
            error: "Resource title and type are required to create a resource",
          });
        }

        if (!Object.values(RESOURCE_TYPES).includes(resource.type)) {
          fastify.log.error("Invalid resource type");
          return reply.status(400).send({ error: "Invalid resource type" });
        }

        // 1) Create the resource and return the inserted row (including id)
        const { data: createdResources, error: createErr } = await supabase
          .from("resources")
          .insert([resource])
          .select("*"); // ensures we get the created row back

        if (createErr || !createdResources?.[0]) {
          fastify.log.error({ createErr }, "Failed to create resource");
          return reply.status(400).send({
            error: createErr?.message ?? "Failed to create resource",
          });
        }

        // RESOURCE CREATED SUCCESSFULLY AND NOW MOVING TO TAGS vvvvvv

        const createdResource = createdResources[0];

        await createTags(fastify, reply, tags, createdResource);
      } catch (err: any) {
        fastify.log.error({ err }, "Unhandled /resources POST error");
        return reply.status(500).send({ error: "Server error" });
      }
    }
  );
}
