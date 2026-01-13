"use client";
import {Resource} from "@know-ledge/shared";
import {Badge} from "@/shared/ui/badge";
import {CircleUser, ExternalLink, Newspaper, Pencil} from "lucide-react";
import {ResourceDeletePrompt} from "@/features/resources/ui/ResourceDeletePrompt";
import {ShareResource} from "@/features/resources/ui/ShareResource";

export type ResourceListProps = {
    resources: Resource[];
};
export const ResourceList = ({resources}: ResourceListProps) => {
    const mappedResources = resources.map((r) => {
        const { article_url, ...rest } = r;
        return {
            ...rest,
            ...(article_url && article_url.trim().length > 0 ? { article_url } : {}),
        };
    });

    return (
        <>
            <div className={"grid grid-cols-2 gap-4"}>
                {mappedResources.map((resource) => (
                    <div
                        key={resource.title}
                        className={"flex flex-col rounded-2xl border p-2.5 pt-4"}
                    >
                        <div className={"flex flex-row"}>
                            <Badge variant="outline">
                                <Newspaper/>
                                {resource.type}
                            </Badge>

                            {resource.canEdit &&  <div className={"ml-auto flex gap-x-2"}>

                                <ShareResource triggerElement={<Pencil size={20}/>} resourceItem={resource} isEditMode={true} />

                                <ResourceDeletePrompt id={resource.id || ""}/>
                            </div>
                            }
                        </div>

                        <p className={"text-md pt-3.5 font-semibold"}>{resource.title}</p>
                        <p className={"pt-1 text-sm"}>{resource.description}</p>

                        <div className={"flex flex-row gap-1 pt-3.5"}>
                            <ExternalLink size={20} href={resource.article_url}/>
                            <a
                                className={"font-semibold underline"}
                                href={resource.article_url}
                                target={"_blank"}
                            >
                                View Article
                            </a>
                        </div>

                        <div className={"flex flex-row gap-1 pt-10"}>
                            {resource.tags?.map((tag) => (
                                <Badge variant="outline" key={tag}>
                                    {tag}
                                </Badge>
                            ))}
                        </div>

                        <div className={"border-t-red-500x mt-3.5 border-t"}>
                            <div className={"justify-centerx flex items-center gap-2 pt-2"}>
                                <CircleUser size={20}/>
                                <p className={"text-md"}>Mike</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
