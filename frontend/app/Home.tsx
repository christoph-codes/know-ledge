"use client";

import { useEffect, useState } from "react";
import fetchRender from "@/shared/lib/fetchRender";
import { Button } from "@/shared/ui/button";
import { User } from "@know-ledge/shared";

export default function Home() {
	const [users, setUsers] = useState<User[]>([]);

	// Fetch users on component mount
	useEffect(() => {
		const fetchUsers = async () => {
			const data = await fetchRender("/users");
			setUsers(data ?? []);
		};
		fetchUsers();
	}, []);

	const addNewSampleUser = async () => {
		console.log("Adding new user");
		return await fetchRender("/users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				userDetails: {
					email: "newuser@example.com",
					name: "New User",
				},
			}),
		});
	};
	return (
		<div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
			<main className="flex h-screen w-full max-w-3xl flex-col items-center justify-between bg-white px-16 py-32 sm:items-start dark:bg-black">
				<h1>Hey</h1>
				{users.map((user) => (
					<div key={user.id}>
						{user.id} - {user.email} - {user.name}
					</div>
				))}
				<Button onClick={addNewSampleUser}>Add Sample User</Button>
			</main>
		</div>
	);
}
