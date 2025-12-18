// ESM
import Fastify from "fastify";
import healthCheckRoutes from "./routes/healthcheck.routes.js";

const fastify = Fastify({
	logger: true,
});

const port = Number(process.env.PORT) || 5555;
console.log("port", port);

// Register routes
fastify.register(healthCheckRoutes);
// fastify.register(supabase);

// Run the server!
fastify.listen({ port }, function (err, address) {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	fastify.log.info(`server listening on ${address}`);
});
