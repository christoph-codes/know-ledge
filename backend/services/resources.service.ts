import { supabase } from "../config/supabase.js";
import { Resource, RESOURCE_TYPES } from "@know-ledge/shared";

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

export const createResource = async (newResource: Partial<Resource>) => {
  if (!newResource.title || newResource.type === undefined) {
    throw new Error("Missing required resource fields");
  }

  if (!Object.values(RESOURCE_TYPES).includes(newResource.type)) {
    throw new Error("Invalid resource type");
  }

  // 1) Create the resource and return the inserted row (including id)
  const { data: createdResources, error: createErr } = await supabase
    .from("resources")
    .insert([newResource])
    .select("*"); // ensures we get the created row back

  if (createErr || !createdResources?.[0]) {
    throw new Error(createErr?.message ?? "Failed to create resource");
  }

  const createdResource = createdResources[0];

  return createdResource as Resource;
};

export const createTags = async (createdResource: Resource, tags: string[]) => {
  // Normalize tags: trim, drop empties, de-dupe, keep consistent casing behavior
  const normalizedTags = Array.from(
    new Set(tags.map((t) => (t ?? "").trim()).filter(Boolean))
  );

  if (normalizedTags.length === 0) {
    // No tags provided: return the full resource
    return createdResource;
  }

  // 2) Fetch any tags that already exist
  const { data: existingTags, error: existingErr } = await supabase
    .from("tags")
    .select("id,name")
    .in("name", normalizedTags);

  if (existingErr) {
    console.error({ existingErr }, "Failed to check existing tags");
    throw new Error("Failed to check tags");
  }

  const existingByName = new Map((existingTags ?? []).map((t) => [t.name, t]));

  // 3) Insert missing tags, then re-fetch (or use upsert returning, depending on your constraints)
  const missingNames = normalizedTags.filter(
    (name) => !existingByName.has(name)
  );

  if (missingNames.length > 0) {
    const { error: insertTagsErr } = await supabase
      .from("tags")
      .insert(missingNames.map((name) => ({ name })));

    if (insertTagsErr) {
      console.error({ insertTagsErr }, "Failed to create tags");
      throw new Error(insertTagsErr?.message ?? "Failed to create tags");
    }
  }

  // Re-fetch all tag rows to get ids for everything
  const { data: allTags, error: allTagsErr } = await supabase
    .from("tags")
    .select("id,name")
    .in("name", normalizedTags);

  if (allTagsErr || !allTags?.length) {
    if (allTagsErr || !allTags?.length) {
      console.error({ allTagsErr }, "Failed to fetch tag ids");
      throw new Error("Failed to fetch tags");
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
      console.error({ joinErr }, "Failed to attach tags to resource");
      throw new Error("Failed to attach tags");
    }

    return { status: "success" };
  }
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
