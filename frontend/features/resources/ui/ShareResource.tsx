"use client";

import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { Resource, RESOURCE_TYPES } from "@know-ledge/shared";
import { TagInputAutocomplete } from "@/features/resources/ui/TagInputAutocomplete";
import { useState } from "react";
import { CodeSnippetInput } from "@/features/resources/ui/CodeSnippetInput";
import { createResource } from "@/features/resources/server/resource.action";

export type ShareResourceProps = {
  resourceItem?: Resource;
  triggerElement: React.ReactNode;
  isEditMode?: boolean;
};

export const ShareResource = ({
  resourceItem,
  triggerElement,
  isEditMode,
}: ShareResourceProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>(
    resourceItem?.tags ?? [],
  );
  const [codeSnippet, setCodeSnippet] = useState<string>(
    resourceItem?.snippet ?? "",
  );
  const [selectedLanguage, setSelectedLanguage] = useState<string>(
    resourceItem?.language ?? "typescript",
  );
  const [resourceType, setResourceType] = useState<string>(
    resourceItem?.type ?? RESOURCE_TYPES.ARTICLE,
  );
  const [title, setTitle] = useState<string>(resourceItem?.title ?? "");
  const [description, setDescription] = useState<string>(
    resourceItem?.description ?? "",
  );
  const [url, setUrl] = useState<string>(resourceItem?.article_url ?? "");
  const [errors, setErrors] = useState<string[]>([]);

  const isCodeSnippet = resourceType === RESOURCE_TYPES.CODE_SNIPPET;

  const availableTags = [
    "React",
    "TypeScript",
    "JavaScript",
    "Node.js",
    "Frontend",
    "Backend",
    "API",
    "Database",
  ];

  console.log("is edit mode ==>", isEditMode);

  const saveResource = async () => {
    setErrors([]);
    if (!title.trim()) {
      setErrors((prevErrors) => [...prevErrors, "Title is required."]);
      return;
    }
    if (
      typeof resourceType !== "string" ||
      !Object.values(RESOURCE_TYPES).includes(resourceType)
    ) {
      setErrors((prevErrors) => [
        ...prevErrors,
        "Valid resource type is required.",
      ]);
      return;
    }
    try {
      const resource: Resource = {
        title: title,
        description: description,
        tags: selectedTags,
        type: resourceType,
        article_url: url,
        snippet: codeSnippet,
        language: selectedLanguage,
      };

      await createResource(resource);
      clearForm();
    } catch (error) {
      console.error("Error creating resource:", error);
      setErrors((prevErrors) => [
        ...prevErrors,
        "Failed to create resource. Please try again.",
      ]);
    }
  };

  const clearForm = () => {

    if(isEditMode) return;

    setTitle("");
    setDescription("");
    setSelectedTags([]);
    setCodeSnippet("");
    setSelectedLanguage("typescript");
    setResourceType(RESOURCE_TYPES.ARTICLE);
    setUrl("");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        {/*<Button className={"w-44 px-4 py-2"}>Share Resource</Button>*/}
        {triggerElement}
      </SheetTrigger>
      <SheetContent
        side={"right"}
        className={`top-28! right-10! bottom-4! left-auto! h-[85%] border-0 p-0 shadow-none`}
      >
        <SheetHeader>
          <SheetTitle>Share a Resource</SheetTitle>
          <SheetDescription>
            Contribute to the knowledge base by sharing valuable content
          </SheetDescription>
        </SheetHeader>
        <div className={"mx-4"}>
          <div className="flex flex-col gap-4">
            <Select onValueChange={setResourceType}>
              <SelectTrigger className="w-full">
                <SelectValue
                  className={"w-full"}
                  placeholder="Select Resource Type"
                >
                  {resourceType !== "--"
                    ? resourceType
                    : "Select Resource Type"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="mt-10">
                <SelectGroup>
                  {Object.values(RESOURCE_TYPES).map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div>
              <label>Title</label>
              <Input
                placeholder="Enter a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label>Description</label>
              <Textarea
                placeholder="Enter a detailed description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <TagInputAutocomplete
                value={selectedTags}
                onChange={setSelectedTags}
                suggestions={availableTags}
                placeholder={"Add tags"}
              />
            </div>

            {isCodeSnippet && (
              <CodeSnippetInput
                value={codeSnippet}
                onChange={setCodeSnippet}
                language={selectedLanguage}
                onLanguageChange={setSelectedLanguage}
              />
            )}

            {!isCodeSnippet && (
              <div>
                <label>Article URL</label>
                <Input
                  placeholder="Enter a URL"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
              </div>
            )}
          </div>
        </div>
        <SheetFooter>
          <div className={"border-t"}>
            {errors.length > 0 && (
              <div className="text-red-500 my-3">
                {errors.map((error, index) => (
                  <p key={error + "-" + index}>{error}</p>
                ))}
              </div>
            )}
            <div className={"mt-2 flex justify-between gap-2"}>
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className={"w-44"}
                  onClick={clearForm}
                >
                  Cancel
                </Button>
              </SheetClose>

              <Button type="submit" className={"w-44"} onClick={saveResource}>
                Share
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
