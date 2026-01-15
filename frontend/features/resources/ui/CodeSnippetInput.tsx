"use client";

import { Textarea } from "@/shared/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeSnippetInputProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  onLanguageChange: (language: string) => void;
  placeholder?: string;
  className?: string;
}

const programmingLanguages = [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "php",
  "go",
  "rust",
  "css",
  "html",
  "sql",
  "bash",
];

export const CodeSnippetInput = ({
  value,
  onChange,
  language,
  onLanguageChange,
  placeholder = "Enter your code snippet here...",
  className = "",
}: CodeSnippetInputProps) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label htmlFor="code-snippet" className="text-sm font-medium">
        Code Snippet
      </label>

      <Select value={language} onValueChange={onLanguageChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select programming language" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {programmingLanguages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Textarea
        id="code-snippet"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-50 font-mono text-sm"
      />

      {value && (
        <div className="overflow-hidden rounded-md border">
          <div className="border-b bg-gray-100 px-3 py-1 text-xs text-gray-600">
            Preview ({language})
          </div>
          <SyntaxHighlighter
            language={language}
            style={vscDarkPlus}
            customStyle={{
              margin: 0,
              fontSize: "0.875rem",
              maxHeight: "200px",
              overflow: "auto",
            }}
          >
            {value}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
};
