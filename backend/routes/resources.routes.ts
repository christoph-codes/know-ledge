import { Resource, RESOURCE_TYPES } from "@know-ledge/shared";
import { FastifyInstance, FastifyRequest } from "fastify";
import { supabase } from "../config/supabase.js";
import { getResources } from "../services/resources.service.js";

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
        Body: { resource: Partial<Resource>; tags?: string[] };
      }>,
      reply
    ) => {
      fastify.log.info("📝 creating resource");

      const { resource, tags = [] } = request.body;

      if (!resource.title || resource.type === undefined) {
        return reply.status(400).send({
          error: "Resource title and type are required to create a resource",
        });
      }

      if (!Object.values(RESOURCE_TYPES).includes(resource.type)) {
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

      const createdResource = createdResources[0];
      const resourceId = createdResource.id;

      // Normalize tags: trim, drop empties, de-dupe, keep consistent casing behavior
      const normalizedTags = Array.from(
        new Set(tags.map((t) => (t ?? "").trim()).filter(Boolean))
      );

      if (normalizedTags.length === 0) {
        // No tags provided: return the full resource
        return reply.send({ ...createdResource, tags: [] });
      }

      // 2) Fetch any tags that already exist
      const { data: existingTags, error: existingErr } = await supabase
        .from("tags")
        .select("id,name")
        .in("name", normalizedTags);

      if (existingErr) {
        fastify.log.error({ existingErr }, "Failed to check existing tags");
        return reply.status(500).send({ error: "Failed to check tags" });
      }

      const existingByName = new Map(
        (existingTags ?? []).map((t) => [t.name, t])
      );

      // 3) Insert missing tags, then re-fetch (or use upsert returning, depending on your constraints)
      const missingNames = normalizedTags.filter(
        (name) => !existingByName.has(name)
      );

      if (missingNames.length > 0) {
        const { error: insertTagsErr } = await supabase
          .from("tags")
          .insert(missingNames.map((name) => ({ name })));

        if (insertTagsErr) {
          fastify.log.error({ insertTagsErr }, "Failed to insert missing tags");
          return reply.status(500).send({ error: "Failed to create tags" });
        }
      }

      // Re-fetch all tag rows to get ids for everything
      const { data: allTags, error: allTagsErr } = await supabase
        .from("tags")
        .select("id,name")
        .in("name", normalizedTags);

      if (allTagsErr || !allTags?.length) {
        fastify.log.error({ allTagsErr }, "Failed to fetch tag ids");
        return reply.status(500).send({ error: "Failed to fetch tags" });
      }

      // 4) Insert join records into resource_tags
      const joinRows = allTags.map((t) => ({
        resource_id: resourceId,
        tag_id: t.id,
      }));

      const { error: joinErr } = await supabase
        .from("resource_tags")
        .insert(joinRows);

      if (joinErr) {
        fastify.log.error({ joinErr }, "Failed to attach tags to resource");
        return reply.status(500).send({ error: "Failed to attach tags" });
      }

      // Return full resource + tags
      return reply.send({
        ...createdResource,
        tags: allTags.sort((a, b) => a.name.localeCompare(b.name)),
      });
    }
  );
}
