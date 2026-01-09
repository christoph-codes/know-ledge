"use server";

import { Resource } from "@know-ledge/shared";
import fetchRender from "@/shared/lib/fetchRender";

export const createResource = async (req: Resource) => {
	console.log(req);
	const result = await fetchRender("/resources", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			resource: req,
		}),
	});
	return { result };
};
