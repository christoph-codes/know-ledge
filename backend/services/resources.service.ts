import { supabase } from "../config/supabase.js";

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
		resource_tags${hasTags ? "!inner" : ""} (
			tag_id,
			tags!inner (
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
    query = query.in("resource_tags.tags.name", tags);
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
