const baseUrl = process.env.NEXT_PUBLIC_RENDER_URL || "";
/**
 * The function `fetchRender` asynchronously fetches data from a specified path using the Render URL
 * and returns the JSON response.
 * @param {string} path - The `path` parameter in the `fetchRender` function is a string that
 * represents the endpoint or route that you want to fetch data from on the Render server. It is
 * concatenated with the `RENDER_URL` environment variable to form the complete URL for the fetch
 * request.
 * @returns The `fetchRender` function is returning a Promise that resolves to the JSON data fetched
 * from the specified path using the `fetch` function. If the response is not successful (status code
 * other than 2xx), an error is thrown with a message indicating the failure to fetch from Render.
 * @example
 * ```ts
 * const data = await fetchRender("/healthcheck");
 * console.log(data); // { status: "ok", timestamp: "2023-10-05T12:34:56.789Z" }
 * ```
 */
const fetchRender = async (path: string, options?: RequestInit) => {
	console.log("RENDER_URL", process.env.RENDER_URL);
	const response = await fetch(`${baseUrl}${path}`, options);
	if (!response.ok) {
		throw new Error(`Failed to fetch from Render: ${response.statusText}`);
	}
	return response.json();
};

export default fetchRender;
