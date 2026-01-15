import { ResourcePayload } from "@know-ledge/shared";
import { FastifyInstance, FastifyRequest } from "fastify";
import {
  createResource,
  deleteResource,
  getResources,
  updateResource,
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
        Body: { payload: ResourcePayload };
      }>,
      reply
    ) => {
      try {
        const { resource, tags = [] } = request.body.payload;

        await createResource(resource, tags);
        return reply.status(201).send({ status: "success" });
      } catch (err: any) {
        fastify.log.error({ err });
        return reply.status(500).send({ error: "Failed to create resource" });
      }
    }
  );

  fastify.patch(
    "/resources/:id",
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: { payload: ResourcePayload };
      }>,
      reply
    ) => {
      try {
        const resourceId = Number(request.params.id);
        const { payload } = request.body;

        const { message } = await updateResource(resourceId, payload);
        return reply.status(200).send({ status: "success", message });
      } catch (err: any) {
        console.error({ err }, "Failed to update resource");
        return reply
          .status(500)
          .send({ error: err.message ?? "Failed to update resource" });
      }
    }
  );

  fastify.delete(
    "/resources/:id",
    async (
      request: FastifyRequest<{
        Params: { id: string };
      }>,
      reply
    ) => {
      try {
        const resourceId = Number(request.params.id);
        const { message } = await deleteResource(resourceId);
        return reply.status(200).send({ status: "success", message });
      } catch (err: any) {
        console.error({ err }, "Failed to delete resource");
        return reply
          .status(500)
          .send({ error: err.message ?? "Failed to delete resource" });
      }
    }
  );
}
