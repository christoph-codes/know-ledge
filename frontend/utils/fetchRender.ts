const fetchRender = async (path: string) => {
	const response = await fetch(`${process.env.RENDER_URL}${path}`);
	if (!response.ok) {
		throw new Error(`Failed to fetch from Render: ${response.statusText}`);
	}
	return response.json();
};

export default fetchRender;
