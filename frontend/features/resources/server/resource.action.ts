"use server";

import { Resource, Tag, ResultType } from "@know-ledge/shared";
import fetchRender from "@/shared/lib/fetchRender";

export const deleteResource = async (id: string): Promise<ResultType<void>> => {
  console.log("deleting resource with id:", id);

  return { ok: true };
  // const result = await fetchRender(`/resources/${id}`, {
  //   method: "DELETE",
  // });
  // return { result };
};

export const createResource = async (req: Resource) => {
  const result = await fetchRender("/resources", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      resource: req,
    }),
  });
  return { result };
};

export const loadResources = async (
  userId?: number,
  tags?: string[],
  searchTerm?: string,
  types?: string[]
): Promise<Resource[]> => {
  const queryParams: Record<string, string> = {};
  const hasTags = tags && tags.length > 0;

  if (userId) queryParams.userId = userId.toString();
  if (hasTags) queryParams.tags = JSON.stringify(tags);
  if (searchTerm) queryParams.searchTerm = searchTerm;
  if (types && types.length > 0)
    queryParams.resourceTypes = JSON.stringify(types);

  // Convert the parameters object to a URL-encoded query string
  const queryString = new URLSearchParams(queryParams).toString();
  const resources = (await fetchRender(
    `/resources?${queryString}`
  )) as Resource[];

  return resources;
};

export const filterResources = async (
  userId?: number,
  selectedResourceTypes?: string[],
  selectedTags?: Tag[],
  searchTerm?: string
): Promise<Resource[]> => {
  const flatTags = selectedTags?.map((tag) => tag.name) ?? [];
  const resources = await loadResources(
    userId,
    flatTags,
    searchTerm,
    selectedResourceTypes
  );

  return resources;
};
