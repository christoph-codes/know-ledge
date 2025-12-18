// Shared types for frontend and backend

export interface User {
	id: string;
	email: string;
	created_at: string;
}

export interface HealthCheckResponse {
	status: "ok" | "error";
	timestamp: string;
	message?: string;
}
