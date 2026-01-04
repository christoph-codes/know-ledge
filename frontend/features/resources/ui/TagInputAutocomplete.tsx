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
}: TagInputAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const popoverRef = React.useRef<HTMLDivElement | null>(null);

  const norm = (s: string) => s.trim();

  const hasTag = (t: string) =>
    value.some((x) => x.toLowerCase() === t.toLowerCase());

  const canAddMore = !maxTags || value.length < maxTags;
  // Replace the onBlur handler with a more reliable approach
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Check if focus is moving to the popover content
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (popoverRef.current?.contains(relatedTarget)) {
      return; // Don't close if focus moved to popover
    }

    // Close after a short delay to allow for click events
    setTimeout(() => setOpen(false), 150);
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

  // Suggestions filtered by draft and removing already selected tags
  const filtered = React.useMemo(() => {
    const q = draft.toLowerCase();
    return suggestions
      .filter((s) => (q ? s.toLowerCase().includes(q) : true))
      .filter((s) => (allowDuplicates ? true : !hasTag(s)));
  }, [draft, suggestions, value, allowDuplicates]);

  const onInputKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();

      if (!allowCustom) return;

      addTag(draft);
      return;
    }

    if (e.key === "Backspace" && !draft && value.length) {
      removeTag(value[value.length - 1] ?? "");
      return;
    }

    // Open dropdown when navigating
    if (e.key === "ArrowDown") setOpen(true);
  };

  return (
    <div className="grid gap-2">
      {label ? <div className="text-sm font-medium">{label}</div> : null}

      <div className="flex items-stretch gap-2">
        <Popover open={open && filtered.length > 0} onOpenChange={setOpen}>
          <PopoverAnchor asChild>
            <div
              className={cn(
                "bg-background flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border px-3 py-2",
                "focus-within:ring-ring focus-within:ring-2 focus-within:ring-offset-2",
              )}
              onClick={() => inputRef.current?.focus()}
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
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onBlur={handleInputBlur}
                onKeyDown={onInputKeyDown}
                placeholder={value.length ? "" : placeholder}
                className="h-6 w-[160px] border-0 p-0 shadow-none focus-visible:ring-0"
              />
            </div>
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
                <CommandEmpty>No results.</CommandEmpty>

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

                {allowCustom && norm(draft) && !hasTag(norm(draft)) ? (
                  <CommandGroup>
                    <CommandItem onSelect={() => addTag(draft)}>
                      Add “{norm(draft)}”
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
