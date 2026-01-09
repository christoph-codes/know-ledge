import { Resource, RESOURCE_TYPES } from "@know-ledge/shared";
import { FastifyInstance, FastifyRequest } from "fastify";
import { supabase } from "../config/supabase.js";

export default async function resourcesRoutes(fastify: FastifyInstance) {
	fastify.get("/resources", async (request, reply) => {
		console.log("☕️ getting resources");
		const resources = await supabase.from("resources").select("*");
		console.log("resources", resources);
		return reply.send(resources.data);
	});

	fastify.post(
		"/resources",
		async (
			request: FastifyRequest<{ Body: { resource: Partial<Resource> } }>,
			reply
		) => {
			console.log("📝 creating resource");
			const { resource } = request.body;
			if (!resource.title || resource.type === undefined) {
				return reply.status(400).send({
					error: "Resource title and type are required to create a resource",
				});
			}
			if (!Object.values(RESOURCE_TYPES).includes(resource.type)) {
				return reply.status(400).send({
					error: "Invalid resource type",
				});
			}
			const newResource = await supabase.from("resources").insert([resource]);
			if (newResource.status !== 201) {
				return reply.status(400).send({
					error: newResource.error ?? "Failed to create resource",
				});
			}
			return reply.send(newResource);
		}
	);
}
