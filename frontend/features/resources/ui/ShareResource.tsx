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
import { Resource, RESOURCE_TYPES, Tag } from "@know-ledge/shared";
import { TagInputAutocomplete } from "@/features/resources/ui/TagInputAutocomplete";
import { useState } from "react";
import { CodeSnippetInput } from "@/features/resources/ui/CodeSnippetInput";
import { createResource } from "@/features/resources/server/resource.action";

export const ShareResource = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [codeSnippet, setCodeSnippet] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] =
    useState<string>("typescript");
  const [resourceType, setResourceType] = useState<string>(
    RESOURCE_TYPES.ARTICLE
  );
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [url, setUrl] = useState<string>("");
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
        tags: selectedTags.map((tagName) => ({ name: tagName }) as Tag),
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
        <Button className={"w-44 px-4 py-2"}>Share Resource</Button>
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
                  {resourceType === "--"
                    ? "Select Resource Type"
                    : resourceType}
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
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                placeholder="Enter a descriptive title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
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
                <label htmlFor="url">Article URL</label>
                <Input
                  id="url"
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
