// ESM
import Fastify from "fastify";

const fastify = Fastify({
	logger: true,
});

// Declare a route
fastify.get("/", function (request, reply) {
	console.log("request", request);
	reply.send({ hello: "world" });
});

// Run the server!
fastify.listen(
	{ port: Number(process.env.PORT) || 5555 },
	function (err, address) {
		if (err) {
			fastify.log.error(err);
			process.exit(1);
		}
		fastify.log.info(`server listening on ${address}`);
	}
);
