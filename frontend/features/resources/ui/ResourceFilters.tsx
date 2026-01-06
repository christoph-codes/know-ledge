import { Badge } from "@/shared/ui/badge";

export type ResourceFiltersProps = {
  resourceTypes: string[];
  tags: string[];
};

export const ResourceFilters = ({
  tags,
  resourceTypes,
}: ResourceFiltersProps) => {
  return (
    <div className={"w-60 rounded-2xl border"}>
      <div className={"m-4"}>
        <p className="pb-3.5 text-lg font-bold">Filters</p>

        <p>Resource Type</p>
        {resourceTypes.map((t) => (
          <label key={t} className="flex items-center pl-1">
            <input type="checkbox" name="resourceType" value={t} />
            <span className="ml-2">{t}</span>
          </label>
        ))}

        <p className={"mt-3.5"}>Tags</p>
        {tags.map((t) => (
          <Badge key={t} variant={"outline"} className={"m-1"}>
            {t}
          </Badge>
        ))}
      </div>
    </div>
  );
};
