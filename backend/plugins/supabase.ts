import fp from "fastify-plugin";
import { createClient } from "@supabase/supabase-js";

export default fp(async function supabasePlugin(fastify) {
	const url = process.env.SUPABASE_PROJECT_URL;
	const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

	if (!url) {
		throw new Error("Missing SUPABASE_PROJECT_URL");
	}
	if (!serviceKey) {
		throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");
	}

	const supabaseAdmin = createClient(url, serviceKey, {
		auth: { persistSession: false, autoRefreshToken: false },
	});

	fastify.decorate("supabase", supabaseAdmin);
});
