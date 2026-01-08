"use client";
import { Search } from "@/features/resources/ui/Search";
import { Resource } from "@/features/resources/domain/models";
import { ResourceList } from "@/features/resources/ui/ResourceList";
import { getResourceTypes, getTags } from "@/features/resources/data/queries";
import { ResourceFilters } from "@/features/resources/ui/ResourceFilters";
import { filterResources } from "@/features/resources/server/resource.action";
import { useState } from "react";

export type ResourceScreenProps = {
  resources: Resource[];
};
export default function ResourceScreen({ resources }: ResourceScreenProps) {
  const tags = getTags();
  const resourceTypes = getResourceTypes();
  const [filteredResources, setFilteredResources] =
    useState<Resource[]>(resources);

  const handleFiltersChange = async (filters: {
    selectedResourceTypes: string[];
    selectedTags: string[];
  }) => {
    const filtered = await filterResources(
      filters.selectedTags,
      filters.selectedResourceTypes,
    );
    setFilteredResources(filtered);
  };

  return (
    <>
      <div className={"mb-10"}>
        <Search />
      </div>
      <div className={"flex flex-row gap-8"}>
        <div className={"w-60"}>
          <ResourceFilters
            resourceTypes={resourceTypes}
            tags={tags}
            onFiltersChange={handleFiltersChange}
          />
        </div>
        <div className={"w-5xl flex-none"}>
          <ResourceList resources={filteredResources} />
        </div>
      </div>
    </>
  );
}
