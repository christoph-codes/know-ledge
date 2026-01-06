"use client";
import { Search } from "@/features/resources/ui/Search";
import { Resource } from "@/features/resources/domain/models";
import { ResourceList } from "@/features/resources/ui/ResourceList";
import { getResourceTypes, getTags } from "@/features/resources/data/queries";
import { ResourceFilters } from "@/features/resources/ui/ResourceFilters";

export type ResourceScreenProps = {
  resources: Resource[];
};
export default function ResourceScreen({ resources }: ResourceScreenProps) {
  const tags = getTags();
  const resourceTypes = getResourceTypes();

  return (
    <>
      <div className={"mb-10"}>
        <Search />
      </div>
      <div className={"flex flex-row gap-8"}>
        <ResourceFilters resourceTypes={resourceTypes} tags={tags} />
        <ResourceList resources={resources} />
      </div>
    </>
  );
}
