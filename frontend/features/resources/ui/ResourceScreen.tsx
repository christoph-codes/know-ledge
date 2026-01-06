"use client";
import { Search } from "@/features/resources/ui/Search";
import { Resource } from "@/features/resources/domain/models";
import { Badge } from "@/shared/ui/badge";
import { CircleUser, ExternalLink, Newspaper } from "lucide-react";

export type ResourceScreenProps = {
  resources: Resource[];
};
export default function ResourceScreen({resources}: ResourceScreenProps) {


  return (
    <>
      <div className={"mb-10"}>
        <Search />
      </div>
      <div className={"grid grid-cols-2 gap-2.5"}>
        {resources.map((resource) => (
          <div
            key={resource.title}
            className={"flex xh-80 flex-col rounded-2xl border p-2.5 pt-4"}
          >
            <Badge variant="outline">
              <Newspaper />
              {resource.resourceType}
            </Badge>
            <p className={"text-md pt-3.5 font-semibold"}>{resource.title}</p>
            <p className={"pt-1 text-sm"}>{resource.description}</p>

            <div className={"flex flex-row gap-1 pt-3.5"}>
              <ExternalLink size={20} href={resource.url} />
              <a
                className={"font-semibold underline"}
                href={resource.url}
                target={"_blank"}
              >
                View Article
              </a>
            </div>

            <div className={"flex flex-row gap-1 pt-10"}>
              {resource.tags.map((tag) => (
                <Badge variant="outline" key={tag}>
                  {tag}
                </Badge>
              ))}
            </div>

            <div className={"mt-3.5 border-t border-t-red-500x"}>
              <div className={"flex items-center justify-centerx gap-2 pt-2"}>
                <CircleUser size={20} />
                <p className={"text-md"}>Mike</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
