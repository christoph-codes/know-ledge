"use client";

import * as React from "react";
import { X, Check } from "lucide-react";

import { cn } from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Popover, PopoverContent, PopoverAnchor } from "@/shared/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";

type TagInputAutocompleteProps = {
  value: string[];
  onChange: (next: string[]) => void;

  /** Suggestions list (e.g. from DB or a constant list) */
  suggestions: string[];

  label?: string;
  placeholder?: string;

  maxTags?: number;
  allowDuplicates?: boolean;

  /** If false, only allow selecting from suggestions */
  allowCustom?: boolean;
};

export function TagInputAutocomplete({
  value,
  onChange,
  suggestions,
  label = "Tags",
  placeholder = "Add a tag…",
  maxTags,
  allowDuplicates = false,
  allowCustom = true,
}: Readonly<TagInputAutocompleteProps>) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const popoverRef = React.useRef<HTMLDivElement | null>(null);

  const norm = (s: string) => s.trim();

  const hasTag = React.useCallback((t: string) =>
    value.some((x) => x.toLowerCase() === t.toLowerCase()), [value]);

  const canAddMore = !maxTags || value.length < maxTags;

  // More reliable blur handler that doesn't interrupt typing
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Check if focus is moving to the popover content
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (popoverRef.current?.contains(relatedTarget)) {
      return; // Don't close if focus moved to popover
    }

    // Only close if we're actually losing focus to something outside the component
    setTimeout(() => {
      if (!inputRef.current?.contains(document.activeElement)) {
        setOpen(false);
      }
    }, 100);
  };

  const addTag = (raw: string) => {
    if (!canAddMore) return;

    const tag = norm(raw);
    if (!tag) return;

    if (!allowDuplicates && hasTag(tag)) {
      setDraft("");
      setOpen(false);
      return;
    }

    onChange([...value, tag]);
    setDraft("");
    setOpen(false);

    // keep focus so you can continue adding
    queueMicrotask(() => inputRef.current?.focus());
  };

  const removeTag = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
    queueMicrotask(() => inputRef.current?.focus());
  };

  const clearAllTags = () => {
    onChange([]);
    queueMicrotask(() => inputRef.current?.focus());
  };

  // Suggestions filtered by draft and removing already selected tags
  const filtered = React.useMemo(() => {
    const q = draft.toLowerCase();
    return suggestions
      .filter((s) => (q ? s.toLowerCase().includes(q) : true))
      .filter((s) => (allowDuplicates ? true : !hasTag(s)));
  }, [draft, suggestions, allowDuplicates, hasTag]);

  const onInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();

      // Try to add the current draft as a tag
      if (norm(draft)) {
        addTag(draft);
      }
      return;
    }

    if (e.key === "Backspace") {
      // Ctrl/Cmd + Backspace: Clear all tags
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        clearAllTags();
        return;
      }

      // Regular Backspace: Remove last tag if input is empty
      if (!draft && value.length) {
        removeTag(value.at(-1) ?? "");
        return;
      }
    }

    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    // Open dropdown when navigating or typing
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setOpen(true);
    }
  };

  return (
    <div className="grid gap-2">
      {label ? <div className="text-sm font-medium">{label}</div> : null}

      <div className="flex items-stretch gap-2">
        <Popover open={open && (filtered.length > 0 || (allowCustom && !!norm(draft) && !hasTag(norm(draft))))} onOpenChange={setOpen}>
          <PopoverAnchor asChild>
            <span role="button"
              // type="button"
              className={cn(
                "bg-background flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border px-3 py-2",
                "focus-within:ring-ring focus-within:ring-2 focus-within:ring-offset-2"
              )}
              onClick={() => inputRef.current?.focus()}
              tabIndex={-1}
              style={{ textAlign: "left" }}
              aria-label="Tag input area"
            >
              {value.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="gap-1 rounded-full px-3 py-1"
                >
                  <span className="leading-none">{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="focus-visible:ring-ring ml-1 inline-flex items-center justify-center rounded-full outline-none focus-visible:ring-2"
                    aria-label={`Remove ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}

              <Input
                ref={inputRef}
                value={draft}
                onChange={(e) => {
                  setDraft(e.target.value);
                  // Always keep the popover open when typing
                  if (!open) setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onBlur={handleInputBlur}
                onKeyDown={onInputKeyDown}
                placeholder={value.length ? "" : placeholder}
                className="h-6 w-40 border-0 p-0 shadow-none focus-visible:ring-0"
              />
            </span>
          </PopoverAnchor>

          <PopoverContent
            ref={popoverRef}
            align="start"
            className="w-[--radix-popover-trigger-width] p-0"
          >
            {/* CommandInput gives you filtering UX, but we keep it in sync with the same draft */}
            <Command shouldFilter={false}>
              <CommandInput
                value={draft}
                onValueChange={(v) => {
                  setDraft(v);
                  setOpen(true);
                }}
                placeholder="Search tags…"
              />
              <CommandList>
                <CommandEmpty>
                  {allowCustom ? "Type to add a new tag" : "No matching tags found"}
                </CommandEmpty>

                <CommandGroup>
                  {filtered.map((s) => (
                    <CommandItem
                      key={s}
                      value={s}
                      onSelect={() => addTag(s)}
                      className="flex items-center justify-between"
                    >
                      <span>{s}</span>
                      {hasTag(s) ? (
                        <Check className="h-4 w-4 opacity-60" />
                      ) : null}
                    </CommandItem>
                  ))}
                </CommandGroup>

                {allowCustom && norm(draft) && !hasTag(norm(draft)) && !suggestions.includes(norm(draft)) ? (
                  <CommandGroup>
                    <CommandItem onSelect={() => addTag(draft)} className="font-medium">
                      Create &ldquo;{norm(draft)}&rdquo;
                    </CommandItem>
                  </CommandGroup>
                ) : null}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Button
          type="button"
          className="shrink-0"
          onClick={() => addTag(draft)}
          disabled={
            !canAddMore || (!allowCustom && !suggestions.includes(norm(draft)))
          }
        >
          Add
        </Button>
      </div>
    </div>
  );
}
