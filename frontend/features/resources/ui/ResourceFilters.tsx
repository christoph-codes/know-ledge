import { Badge } from "@/shared/ui/badge";
import { Tag } from "@know-ledge/shared";
import { useState } from "react";

export type ResourceFiltersProps = {
  resourceTypes: string[];
  tags: Tag[];
  onFiltersChange?: (filters: {
    selectedResourceTypes: string[];
    selectedTags: Tag[];
  }) => void;
};

export const ResourceFilters = ({
  tags,
  resourceTypes,
  onFiltersChange,
}: ResourceFiltersProps) => {
  const [selectedResourceTypes, setSelectedResourceTypes] = useState<string[]>(
    []
  );
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  const handleResourceTypeChange = (resourceType: string) => {
    const newSelectedTypes = selectedResourceTypes.includes(resourceType)
      ? selectedResourceTypes.filter((type) => type !== resourceType)
      : [...selectedResourceTypes, resourceType];

    setSelectedResourceTypes(newSelectedTypes);
    onFiltersChange?.({
      selectedResourceTypes: newSelectedTypes,
      selectedTags,
    });
  };

  const handleTagClick = (tag: Tag) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];

    setSelectedTags(newSelectedTags);
    onFiltersChange?.({
      selectedResourceTypes,
      selectedTags: newSelectedTags,
    });
  };

  return (
    <div className={"w-60 rounded-2xl border"}>
      <div className={"m-4"}>
        <p className="pb-3.5 text-lg font-bold">Filters</p>

        <p>Resource Type</p>
        {resourceTypes.map((t) => (
          <label key={t} className="flex items-center pl-1">
            <input
              type="checkbox"
              name="resourceType"
              value={t}
              checked={selectedResourceTypes.includes(t)}
              onChange={() => handleResourceTypeChange(t)}
            />
            <span className="ml-2">{t}</span>
          </label>
        ))}

        <p className={"mt-3.5"}>Tags</p>
        {tags.map((t) => (
          <Badge
            key={t.id}
            variant={selectedTags.includes(t) ? "default" : "outline"}
            className={
              "m-1 cursor-pointer transition-colors hover:bg-gray-100 hover:text-gray-800"
            }
            onClick={() => handleTagClick(t)}
          >
            {t.name}
          </Badge>
        ))}
      </div>
    </div>
  );
};
