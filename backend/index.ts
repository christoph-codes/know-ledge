// ESM
import "dotenv/config";
import Fastify from "fastify";
import healthCheckRoutes from "./routes/healthcheck.routes.js";
import usersRoutes from "./routes/users.routes.js";
import cors from "@fastify/cors";

const fastify = Fastify({
	// logger: true,
});

const host = "RENDER" in process.env ? `0.0.0.0` : `localhost`;
const port = Number(process.env.PORT) || 5555;

fastify.register(cors, {
	origin: [
		process.env.LOCAL_ORIGIN,
		process.env.RENDER_URL,
		process.env.PROD_ORIGIN,
	].filter(Boolean),
	credentials: true,
});
fastify.register(healthCheckRoutes);
fastify.register(usersRoutes);

// Run the server!
fastify.listen({ host, port }, function (err, address) {
	if (err) {
		fastify.log.error(err);
		process.exit(1);
	}
	fastify.log.info(`server listening on ${address}`);
});
