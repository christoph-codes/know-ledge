"use client";
import { Search } from "@/features/resources/ui/Search";
import { Resource, Tag } from "@know-ledge/shared";
import { ResourceList } from "@/features/resources/ui/ResourceList";
import { ResourceFilters } from "@/features/resources/ui/ResourceFilters";
import { filterResources } from "@/features/resources/resource.action";
import { useState, useEffect } from "react";
import { Button } from "@/shared/ui/button";
import { Toaster } from "sonner";

export type ResourceScreenProps = {
  resources: Resource[];
  initialTags?: Tag[];
  userId: number;
  resourceTypes: string[];
};
export default function ResourceScreen({
  resources,
  initialTags,
  userId,
  resourceTypes = [],
}: Readonly<ResourceScreenProps>) {
  const [userIdToggle, setUserIdToggle] = useState<number | undefined>(
    undefined
  );
  const [tags] = useState<Tag[]>(initialTags ?? []);
  const [selectedResourceTypes, setSelectedResourceTypes] =
    useState<string[]>(resourceTypes);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredResources, setFilteredResources] =
    useState<Resource[]>(resources);

  const handleFiltersChange = async (filters: {
    selectedResourceTypes: string[];
    selectedTags: Tag[];
  }) => {
    setSelectedResourceTypes(filters.selectedResourceTypes);
    setSelectedTags(filters.selectedTags);
  };

  // Trigger handleFiltersChange when searchTerm changes
  useEffect(() => {
    (async () => {
      const filtered = await filterResources(
        userIdToggle,
        selectedResourceTypes,
        selectedTags,
        searchTerm
      );
      setFilteredResources(filtered);
    })();
  }, [searchTerm, selectedResourceTypes, selectedTags, userIdToggle]);

  const handleUserResourcesClick = () => {
    setUserIdToggle((prev) => (prev === undefined ? userId : undefined));
  };

  return (
    <>
      <Toaster position={"top-center"} />
      <div className="flex flex-col gap-2">
        <p className={"mb-2 text-2xl font-medium"}>Discover Resources</p>
        <p className={"pb-6 text-lg"}>
          {" "}
          Explore shared knowledge from our community
        </p>
      </div>
      <div className="mb-10">
        <Search term={searchTerm} onChange={setSearchTerm} />
      </div>
      <div className={"flex flex-row gap-8"}>
        <div className={"w-60"}>
          <Button
            variant="secondary"
            className="w-full mb-5"
            onClick={handleUserResourcesClick}
          >
            Showing {userIdToggle == undefined ? "All" : "My"} Resources
          </Button>
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
