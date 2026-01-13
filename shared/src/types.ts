// Shared types for frontend and backend

export interface User {
  id: number;
  email: string;
  created_at: string;
  name?: string;
}

export interface HealthCheckResponse {
  status: "ok" | "error";
  timestamp: string;
  message?: string;
}

export const RESOURCE_TYPES = {
  ARTICLE: "article",
  CODE_SNIPPET: "code_snippet",
  LEARNING: "learning",
  COURSE: "course",
  PODCAST: "podcast",
};

export type ResourceType = (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES];

export interface Resource {
  id?: number; // unique identifier
  type: ResourceType;
  title: string;
  description?: string;
  tags?: Tag[];
  article_url?: string;
  snippet?: string;
  language?: string;
  created_at?: string;
  user?: Omit<User, "created_at">;
}

export interface Tag {
  id?: number; // unique identifier
  name: string;
  created_at?: string;
}
