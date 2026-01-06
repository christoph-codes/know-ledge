'use server';

import { Resource } from "@/features/resources/domain/models";

export const createResource = async (req: Resource) => {
  console.log(req);
  //TODO: Implement resource creation logic
}

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
      tags: ["react", "patterns"],
      resourceType: "Article",
    },
    {
      title: "Server Actions",
      description: "Collection of React design patterns.",
      url: "https://reactpatterns.com/",
      tags: ["react", "patterns"],
      resourceType: "Article",
    },
  ];
  return sample;
}