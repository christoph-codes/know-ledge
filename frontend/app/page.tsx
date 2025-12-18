import { Button } from "@/components/ui/button";
import fetchRender from "@/utils/fetchRender";

export default async function Home() {
	const data = await fetchRender("/healthcheck");
	console.log("healthcheck", data);
	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<main className="flex h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
				<h1>Hey</h1>
				<Button>Click Me</Button>
			</main>
		</div>
	);
}
