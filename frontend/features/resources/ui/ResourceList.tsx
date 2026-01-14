"use client";
import {Resource, RESOURCE_TYPES} from "@know-ledge/shared";
import {Badge} from "@/shared/ui/badge";
import {CircleUser, Code, ExternalLink, Newspaper, Pencil} from "lucide-react";
import {ResourceDeletePrompt} from "@/features/resources/ui/ResourceDeletePrompt";
import {ShareResource} from "@/features/resources/ui/ShareResource";
import {ViewCodeSnippet} from "@/features/resources/ui/ViewCodeSnippet";

export type ResourceListProps = {
    resources: Resource[];
};
export const ResourceList = ({resources}: ResourceListProps) => {
    const mappedResources = resources.map((r) => {
        const {article_url, ...rest} = r;
        return {
            ...rest,
            ...(article_url && article_url.trim().length > 0 ? {article_url} : {}),
        };
    });

    return (
        <>
            <p className="py-1 mb-5">{resources.length} resources found</p>
            <div className={"grid grid-cols-2 gap-4"}>

                {mappedResources.map((resource) => (
                    <div
                        key={resource.id}
                        className={"flex flex-col rounded-2xl border p-2.5 pt-4"}
                    >
                        <div className={"flex flex-row"}>
                            <Badge variant="outline">
                                {(resource.type === RESOURCE_TYPES.CODE_SNIPPET)  ?  <Code size={20} /> :  <Newspaper size={20}/>}

                                {resource.type}
                            </Badge>

                            {resource.canEdit && resource.id && <div className={"ml-auto flex gap-x-2"}>

                                <ShareResource triggerElement={<Pencil size={20}/>} resourceItem={resource}
                                               isEditMode={true}/>

                                <ResourceDeletePrompt id={resource?.id}/>
                            </div>
                            }
                        </div>

                        <p className={"text-md pt-3.5 font-semibold"}>{resource.title}</p>
                        <p className={"pt-1 text-sm"}>{resource.description}</p>

                        <div className={"flex flex-row gap-1 pt-3.5"}>
                            {(resource.type === RESOURCE_TYPES.CODE_SNIPPET) &&

                                <ViewCodeSnippet resource={resource}
                                                 triggerElement={
                                                     <div className={'flex flex-row gap-x-2'}>
                                                         <Code size={20} />
                                                         <p className={'underline font-semibold'}>View Code</p>
                                                     </div>
                                                 }/>
                            }

                            {(resource.type !== RESOURCE_TYPES.CODE_SNIPPET) &&
                                <>
                                    <ExternalLink size={20} href={resource.article_url}/>
                                    <a
                                        className={"font-semibold underline"}
                                        href={resource.article_url}
                                        target={"_blank"}
                                    >
                                        View Article
                                    </a>
                                </>
                            }

                        </div>

                        <div className={"flex flex-row gap-1 pt-10"}>
                            {resource.tags?.map((tag) => (
                                <Badge variant="outline" key={tag.id}>
                                    {tag.name}
                                </Badge>
                            ))}
                        </div>

                        <div className={"border-t-red-500x mt-3.5 border-t"}>
                            <div className={"justify-centerx flex items-center gap-2 pt-2"}>
                                <CircleUser size={20}/>
                                <p className={"text-md"}>{resource.user?.name}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};
