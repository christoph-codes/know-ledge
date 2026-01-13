"use client";
import { useEffect, useRef, useState } from "react";
import { SearchIcon } from "lucide-react";
import { Input } from "@/shared/ui/input";

export type SearchProps = {
  term: string;
  onChange: (value: string) => void;
};

export const Search = ({ term, onChange }: SearchProps) => {
  const [localTerm, setLocalTerm] = useState(term);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }
    debounceTimeout.current = setTimeout(() => {
      onChange(localTerm);
    }, 400); // 400ms debounce
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [localTerm, onChange]);

  return (
    <div
      className={
        "flex flex-row flex-1 items-center justify-start gap-0 rounded-lg border border-gray-200 p-2"
      }
    >
      <SearchIcon size={30} />{" "}
      <Input
        id="resourceSearch"
        name="resourceSearch"
        className={"border-none! text-lg shadow-none! focus-visible:ring-0!"}
        placeholder={"Search resource by title or description"}
        value={localTerm}
        onChange={(e) => setLocalTerm(e.target.value)}
      />
    </div>
  );
};
