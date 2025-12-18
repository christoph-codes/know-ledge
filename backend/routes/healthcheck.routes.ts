import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

export default async function healthCheckRoutes(fastify: FastifyInstance) {
	fastify.get(
		"/healthcheck",
		async (request: FastifyRequest, reply: FastifyReply) => {
			console.log("Healthcheck requested");
			return reply.send({
				status: "ok",
				isDBConnected: Boolean(fastify.supabase),
				timestamp: new Date(),
			});
		}
	);
}
