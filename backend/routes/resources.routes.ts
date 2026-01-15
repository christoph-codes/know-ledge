import { Resource } from "@know-ledge/shared";
import { FastifyInstance, FastifyRequest } from "fastify";
import {
  createResource,
  createTags,
  getResources,
} from "../services/resources.service.js";

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
        const { resource, tags = [] } = request.body.payload;
        const createdResource = await createResource(resource);

        await createTags(createdResource, tags);

        return reply.status(201).send({ status: "success" });
      } catch (err: any) {
        fastify.log.error({ err });
        return reply.status(500).send({ error: "Failed to create resource" });
      }
    }
  );
}
