"use client";
import { SearchIcon } from "lucide-react";
import { Input } from "@/shared/ui/input";

export const Search = () => {
  return (
    <div>
      <div className={"flex flex-col"}>
        <p className={"mb-2 text-2xl font-medium"}>Discover Resources</p>
        <p className={"pb-6 text-lg"}>
          {" "}
          Explore shared knowledge from our community
        </p>

        <div
          className={
            "flex flex-row items-center justify-start gap-2 rounded-lg border border-gray-200 p-2"
          }
        >
          <SearchIcon size={30} />{" "}
          <Input
            className={"border-none text-lg"}
            placeholder={"Search resource by title or description"}
          />
        </div>
      </div>
    </div>
  );
};
