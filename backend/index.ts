// ESM
import "dotenv/config";
import Fastify from "fastify";
import healthCheckRoutes from "./routes/healthcheck.routes.js";
import supabase from "./plugins/supabase.js";

const fastify = Fastify({
	logger: true,
});

const host = "RENDER" in process.env ? `0.0.0.0` : `localhost`;
const port = Number(process.env.PORT) || 5555;

// Register routes
fastify.register(supabase);
fastify.register(healthCheckRoutes);

// Run the server!
fastify.listen({ host, port }, function (err, address) {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	fastify.log.info(`server listening on ${address}`);
});
