import fetchRender from "@/shared/lib/fetchRender";
import { RESOURCE_TYPES } from "@know-ledge/shared";

export const getResourceTypes = (): string[] => {
  return Object.values(RESOURCE_TYPES);
};

export const getTags = async () => {
  const result = await fetchRender("/tags");
  return result;
};
