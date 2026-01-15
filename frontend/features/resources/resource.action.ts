"use server";

import {
  Resource,
  Tag,
  ResultType,
  ResourcePayload,
  ResponseStatus,
  RESPONSE_STATUS,
} from "@know-ledge/shared";
import fetchRender from "@/shared/lib/fetchRender";
import { getCurrentUser } from "@/shared/server/auth";

export const createResource = async (req: ResourcePayload) => {
  const userResult = await getCurrentUser();
  if (userResult.status === RESPONSE_STATUS.SUCCESS && userResult.data) {
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
    body: JSON.stringify(req),
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
  const loggedInUserId =
    result.status === RESPONSE_STATUS.SUCCESS && result.data
      ? result.data.id
      : undefined;

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
  payload: ResourcePayload
): Promise<ResultType<Resource>> => {
  console.log("☕️ updating resource with id:", id);

  const result = await getCurrentUser();
  if (result.status === RESPONSE_STATUS.SUCCESS && result.data) {
    payload.user = {
      id: Number(result.data.id),
      email: result.data.email,
      name: result.data.name ?? "",
    };
  }

  const response = await fetchRender(`/resources/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ payload }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.status !== RESPONSE_STATUS.SUCCESS) {
    throw new Error(response?.message || "Failed to update resource");
  }

  return {
    status: RESPONSE_STATUS.SUCCESS as ResponseStatus,
    message: "Resource updated successfully",
    data: response,
  };
};

export const deleteResource = async (id: number): Promise<ResultType<void>> => {
  console.log("❌ deleting resource with id:", id);

  const result = await getCurrentUser();
  if (result.status === RESPONSE_STATUS.ERROR) {
    throw new Error("User must be logged in to delete a resource");
  }

  await fetchRender(`/resources/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return {
    status: RESPONSE_STATUS.SUCCESS as ResponseStatus,
    message: "Resource deleted successfully",
  };
};
