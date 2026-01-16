import "server-only";
import fetchRender from "@/shared/lib/fetchRender";
import { RESOURCE_TYPES } from "@know-ledge/shared";

export const loadResourceTypes = (): string[] => {
  return Object.values(RESOURCE_TYPES);
};

export const loadTags = async () => {
  const result = await fetchRender("/tags");
  return result;
};
