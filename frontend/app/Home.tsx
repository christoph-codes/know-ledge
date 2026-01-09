"use client";

import { useEffect, useState } from "react";
import fetchRender from "@/shared/lib/fetchRender";
import { Resource } from "@know-ledge/shared";

export default function Home() {
	const [resources, setResources] = useState<Resource[]>([]);


	// Fetch resources on component mount
	useEffect(() => {
		const fetchResources = async () => {
			const data = await fetchRender("/resources");
			console.log('data', data);
			setResources(data ?? []);
		};
		fetchResources();
	}, []);
	
	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<main className="flex h-screen w-full max-w-3xl flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
				{resources.map((resource) => (
					<div key={resource.id}>
						{resource.id} - {resource.title} - {resource.type}
					</div>
				))}
			</main>
		</div>
	);
}
