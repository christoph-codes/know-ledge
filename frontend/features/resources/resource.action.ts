"use server";

import { Resource, Tag, ResultType, User } from "@know-ledge/shared";
import fetchRender from "@/shared/lib/fetchRender";
import { getCurrentUser } from "@/shared/server/auth";

export type CreateResourceRequest = {
  resource: Resource;
  tags: string[];
  user?: User;
};

export const createResource = async (req: CreateResourceRequest) => {
  const userResult = await getCurrentUser();
  if (userResult.ok && userResult.data) {
    req.user = {
      id: Number(userResult.data.id),
      email: userResult.data.email,
      name: userResult.data.name ?? "",
    };
  }

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

  const result = await getCurrentUser();
  const loggedInUserId = result.ok && result.data ? result.data.id : undefined;

  return resources.map((r) => ({
    ...r,
    canEdit: r.user?.id === loggedInUserId,
  }));
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

export const updateResource = async (
  id: number,
  req: Partial<Resource>
): Promise<ResultType<void>> => {
  console.log("updating resource with id:", id, "and data:", req);
  const result = await getCurrentUser();
  if (result.ok && result.data) {
    req.user = {
      id: Number(result.data.id),
      email: result.data.email,
      name: result.data.name ?? "",
    };
  }

  return { ok: true };
};

export const deleteResource = async (id: number): Promise<ResultType<void>> => {
  console.log("deleting resource with id:", id);

  const result = await getCurrentUser();
  if (result.ok && result.data) {
    console.log("deleting resource with id:", id);
    console.log("with userId:", Number(result.data.id));
  }

  return { ok: true };
};
