// Shared types for frontend and backend

export interface User {
	id: string;
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
	id?: string; // unique identifier
	type: ResourceType;
	title: string;
	description?: string;
	tags?: string[];
	article_url?: string;
	snippet?: string;
	language?: string;
	created_at?: string;
	canEdit?: boolean;
	user_id?: number;
}

export type ResultType<T> = {
  ok: true;
  data?: T;
} |{ ok: false; error: string };
