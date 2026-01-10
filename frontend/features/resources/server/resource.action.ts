"use server";

import { Resource } from "@know-ledge/shared";
import fetchRender from "@/shared/lib/fetchRender";

export const createResource = async (req: Resource) => {
  console.log(req);
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

export const loadResources = async (): Promise<Resource[]> => {
  const results = (await fetchRender("/resources")) as Resource[];

  return results.map((result) => ({
    ...result,
    tags: JSON.parse(result.tags as unknown as string),
  }));

  // return [
  //   {
  //     title: "Intro to TypeScript",
  //     description: "A concise guide to TypeScript basics.",
  //     url: "https://www.typescriptlang.org/",
  //     tags: ["typescript", "guide"],
  //     resourceType: "Article",
  //   },
  //   {
  //     title: "React Patterns",
  //     description: "Collection of React design patterns.",
  //     url: "https://reactpatterns.com/",
  //     tags: ["react", "patterns"],
  //     resourceType: "Article",
  //   },
  //   {
  //     title: "Design Patterns",
  //     description: "Collection of React design patterns.",
  //     url: "https://reactpatterns.com/",
  //     tags: ["patterns"],
  //     resourceType: "Article",
  //   },
  //   {
  //     title: "Server Actions",
  //     description: "Collection of React design patterns.",
  //     url: "https://reactpatterns.com/",
  //     tags: ["react", "patterns", "nextjs"],
  //     resourceType: "Learning Resource",
  //   },
  // ];
};

export const filterResources = async (
  selectedTags: string[],
  selectedResourceTypes: string[],
): Promise<Resource[]> => {
  const resources = await loadResources();

  let filtered: Resource[] = resources;
  if (selectedTags.length > 0) {
    filtered = resources.filter((resource) =>
      resource.tags?.some((tag) => {
        return selectedTags
          .map((st) => st.toLowerCase())
          .includes(tag.toLowerCase());
      }),
    );
  }
  if (selectedResourceTypes.length > 0) {
    filtered = filtered.filter((resource) =>
      selectedResourceTypes.includes(resource.type),
    );
  }

  return filtered;
};
