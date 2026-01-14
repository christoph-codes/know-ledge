import { FastifyInstance, FastifyReply } from "fastify";
import { supabase } from "../config/supabase.js";
import { Resource } from "@know-ledge/shared";

export type GetResourceParams = {
  userId?: string;
  tags?: string[];
  searchTerm?: string;
  resourceTypes?: string[];
};

export const getResources = async ({
  userId,
  tags,
  searchTerm,
  resourceTypes,
}: GetResourceParams) => {
  const hasTags = Array.isArray(tags) && tags.length > 0;
  const hasTypes = Array.isArray(resourceTypes) && resourceTypes.length > 0;
  let query = supabase.from("resources").select(
    `
    *,
    match_tags:resource_tags${hasTags ? "!inner" : ""} (
      tags!inner (
        name
      )
    ),
    resource_tags (
      tag_id,
      tags (
        id,
        name
      )
    ),
    user:users (
      id,
      name,
      email
    )
  `
  );
  if (hasTags) {
    // will only return resources that have ALL specified tags
    // query = query.in("resource_tags.tags.name", tags);
    query = query.in("match_tags.tags.name", tags);
  }
  if (searchTerm) {
    query = query.ilike("title", `%${searchTerm}%`);
  }
  if (hasTypes) {
    query = query.in("type", resourceTypes);
  }

  if (userId) {
    query = query.eq("user_id", userId);
  }

  return await query;
};

export const createTags = async (
  fastify: FastifyInstance,
  reply: FastifyReply,
  tags: string[],
  createdResource: Resource
) => {
  // Normalize tags: trim, drop empties, de-dupe, keep consistent casing behavior
  const normalizedTags = Array.from(
    new Set(tags.map((t) => (t ?? "").trim()).filter(Boolean))
  );

  if (normalizedTags.length === 0) {
    // No tags provided: return the full resource
    return reply.send({ ...createdResource });
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

  const existingByName = new Map((existingTags ?? []).map((t) => [t.name, t]));

  // 3) Insert missing tags, then re-fetch (or use upsert returning, depending on your constraints)
  const missingNames = normalizedTags.filter(
    (name) => !existingByName.has(name)
  );

  if (missingNames.length > 0) {
    console.log("missingNames", missingNames);
    const { error: insertTagsErr } = await supabase
      .from("tags")
      .insert(missingNames.map((name) => ({ name })));

    if (insertTagsErr) {
      fastify.log.error(insertTagsErr.message);
      return reply.status(500).send({
        error: insertTagsErr?.message ?? "Failed to create tags",
      });
    }
  }

  // Re-fetch all tag rows to get ids for everything
  const { data: allTags, error: allTagsErr } = await supabase
    .from("tags")
    .select("id,name")
    .in("name", normalizedTags);

  console.log("allTags", allTags);

  if (allTagsErr || !allTags?.length) {
    fastify.log.error({ allTagsErr }, "Failed to fetch tag ids");
    return reply.status(500).send({ error: "Failed to fetch tags" });
  }

  // 4) Insert join records into resource_tags
  const joinRows = allTags.map((t) => ({
    resource_id: createdResource.id,
    tag_id: t.id,
  }));
  console.log("joinRows", joinRows);

  const { error: joinErr } = await supabase
    .from("resource_tags")
    .insert(joinRows);

  if (joinErr) {
    fastify.log.error({ joinErr }, "Failed to attach tags to resource");
    return reply.status(500).send({ error: "Failed to attach tags" });
  }

  return reply.send({ status: "successfully created tags" });
};

export const updateResource = async (
  resourceId: number,
  updates: Partial<Resource>
) => {
  const { data, error } = await supabase
    .from("resources")
    .update(updates)
    .eq("id", resourceId)
    .select("*");

  if (error) {
    console.error("Failed to update resource", error);
    return { error };
  }

  return { data };
};

// MIKE STAY HERE!
export const deleteResource = async (resourceId: number) => {
  const { error } = await supabase
    .from("resources")
    .delete()
    .eq("resource_id", resourceId);

  if (error) {
    console.log("error", error);
  }

  return error;
};
