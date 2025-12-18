// ESM
import Fastify from "fastify";
import healthCheckRoutes from "./routes/healthcheck.routes.js";

const fastify = Fastify({
	logger: true,
});

const host = "RENDER" in process.env ? `0.0.0.0` : `localhost`;
const port = Number(process.env.PORT) || 5555;
console.log("port", port);

// Register routes
fastify.register(healthCheckRoutes);
// fastify.register(supabase);

// Run the server!
fastify.listen({ host, port }, function (err, address) {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	fastify.log.info(`server listening on ${address}`);
});
