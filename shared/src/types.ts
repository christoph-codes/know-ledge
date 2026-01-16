// Shared types for frontend and backend

export interface User {
  id?: number;
  email: string;
  created_at?: string;
  name?: string;
  auth_id?: string;
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
  tags?: Tag[]; // will only apply when fetching resources with their tags
  article_url?: string;
  snippet?: string;
  language?: string;
  created_at?: string;
  user_id?: number;
  user?: Omit<User, "created_at">; // will only apply when fetching resources with their user info
  canEdit?: boolean; // indicates if the current user can edit this resource
}

export interface Tag {
  id?: number; // unique identifier
  name: string;
  created_at?: string;
}

export interface ResourcePayload {
  resource: Partial<Resource>;
  tags?: string[];
  user?: User;
}

export const RESPONSE_STATUS = {
  SUCCESS: "success",
  ERROR: "error",
} as const;

export type ResponseStatus =
  (typeof RESPONSE_STATUS)[keyof typeof RESPONSE_STATUS];

export type ResultType<T> = {
  status: ResponseStatus;
  message: string;
  data?: T;
};
