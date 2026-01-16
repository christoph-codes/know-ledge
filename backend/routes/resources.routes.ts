import { ResourcePayload } from "@know-ledge/shared";
import { FastifyInstance, FastifyRequest } from "fastify";
import {
  createResource,
  deleteResource,
  getResources,
  updateResource,
} from "../services/resources.service.js";
import { requireAuth } from "../middleware/auth.js";

interface PatchResourceRoute {
  Params: { id: string };
  Body: { payload: ResourcePayload };
}

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

  // CRITICAL: POST route requires authentication
  // LEARNING: The { preHandler: requireAuth } option runs authentication before the route handler
  fastify.post(
    "/resources",
    {
      preHandler: (request, reply, done) => {
        console.log("☕️ authenticating request in preHandler");
        requireAuth(request, reply, done)
          .then(() => done())
          .catch(done);
      },
    },
    async (
      request: FastifyRequest<{ Body: { payload: ResourcePayload } }>,
      reply: import("fastify").FastifyReply
    ) => {
      try {
        const { resource, tags = [], user } = request.body.payload;
        const newResource = { ...resource, user_id: user?.id };

        await createResource(newResource, tags);
        return reply.status(201).send({ status: "success" });
      } catch (err: any) {
        console.error({ err });
        return reply.status(500).send({ error: "Failed to create resource" });
      }
    }
  );

  fastify.patch<PatchResourceRoute>(
    "/resources/:id",
    {
      preHandler: (request, reply, done) => {
        console.log("☕️ authenticating request in preHandler");
        requireAuth(request, reply, done)
          .then(() => done())
          .catch(done);
      },
    },
    async (request, reply) => {
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

  fastify.delete<{
    Params: { id: string; userId: string };
  }>(
    "/resources/:id/user/:userId",
    {
      preHandler: (request, reply, done) => {
        console.log("❌ authenticating request in preHandler");
        requireAuth(request, reply, done)
          .then(() => done())
          .catch(done);
      },
    },
    async (request, reply) => {
      try {
        const resourceId = Number(request.params.id);
        const userId = Number(request.params.userId);
        const { message } = await deleteResource(resourceId, userId);
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
