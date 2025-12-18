import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { HealthCheckResponse } from "@know-ledge/shared";

export default async function healthCheckRoutes(fastify: FastifyInstance) {
	fastify.get(
		"/healthcheck",
		async (request: FastifyRequest, reply: FastifyReply) => {
			console.log("Healthcheck requested");
			const response: HealthCheckResponse = {
				status: "ok",
				message: "Server is healthy",
				timestamp: new Date().toISOString(),
			};
			return reply.send(response);
		}
	);
}
