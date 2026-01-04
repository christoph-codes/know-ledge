'use client';

import { Button } from "@/shared/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { getResourceTypes } from "@/features/resources/data/queries";
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
import { TagInputAutocomplete } from "@/features/resources/ui/TagInputAutocomplete";
import { useState } from "react";

export const ShareResource = () => {
  const resourceTypes = getResourceTypes();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className={"w-44 px-4 py-2"}>Share Resource</Button>
      </SheetTrigger>
      <SheetContent
        side={"right"}
        className={`!top-28 !right-10 !bottom-4 !left-auto h-[85%] border-0 p-0 shadow-none`}
      >
        <SheetHeader>
          <SheetTitle>Share a Resource</SheetTitle>
          <SheetDescription>
            Contribute to the knowledge base by sharing valuable content
          </SheetDescription>
        </SheetHeader>
        <div className={"mx-4"}>
          <div className="flex flex-col gap-4">
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue
                  className={"w-full"}
                  placeholder="Select Resource Type"
                />
              </SelectTrigger>
              <SelectContent className="mt-10">
                <SelectGroup>
                  {resourceTypes.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <div>
              <label>Title</label>
              <Input placeholder="Enter a descriptive title" />
            </div>

            <div>
              <label>Description</label>
              <Textarea placeholder="Enter a detailed description" />
            </div>

            <div>
              <TagInputAutocomplete
                value={selectedTags}
                onChange={setSelectedTags}
                suggestions={availableTags}
                placeholder={"Add tags"}

              />
            </div>
          </div>
        </div>
        <SheetFooter>
          <Button type="submit">Save changes</Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
