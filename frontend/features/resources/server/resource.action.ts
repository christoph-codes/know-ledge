"use server";

import { Resource } from "@/features/resources/domain/models";

export const createResource = async (req: Resource) => {
  console.log(req);
  //TODO: Implement resource creation logic
};

export const loadResources = async (): Promise<Resource[]> => {
  const sample: Resource[] = [
    {
      title: "Intro to TypeScript",
      description: "A concise guide to TypeScript basics.",
      url: "https://www.typescriptlang.org/",
      tags: ["typescript", "guide"],
      resourceType: "Article",
    },
    {
      title: "React Patterns",
      description: "Collection of React design patterns.",
      url: "https://reactpatterns.com/",
      tags: ["react", "patterns"],
      resourceType: "Article",
    },
    {
      title: "Design Patterns",
      description: "Collection of React design patterns.",
      url: "https://reactpatterns.com/",
      tags: ["patterns"],
      resourceType: "Article",
    },
    {
      title: "Server Actions",
      description: "Collection of React design patterns.",
      url: "https://reactpatterns.com/",
      tags: ["react", "patterns", "nextjs"],
      resourceType: "Learning Resource",
    },
  ];
  return sample;
};

export const filterResources = async (
  selectedTags: string[],
  selectedResourceTypes: string[],
): Promise<Resource[]> => {
  const resources = await loadResources();

  console.log(
    "selectedTags ==> ",
    selectedTags.map((tag) => tag.toLowerCase()),
  );
  console.log("selectedResourceTypes ==> ", selectedResourceTypes);

  let filtered: Resource[] = resources;
  if (selectedTags.length > 0) {
    filtered = resources.filter((resource) =>
      resource.tags.some((tag) => {
        return selectedTags
          .map((st) => st.toLowerCase())
          .includes(tag.toLowerCase());
      }),
    );

    // console.log("test-filtered", x);
  }
  if (selectedResourceTypes.length > 0) {
    filtered = filtered.filter((resource) =>
      selectedResourceTypes.includes(resource.resourceType),
    );
  }
  // const filtered

  console.log("filtered", filtered.length);
  return filtered;
};
