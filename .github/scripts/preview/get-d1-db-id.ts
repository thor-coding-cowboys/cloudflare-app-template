#!/usr/bin/env bun

import { $ } from "bun";

const prNumber = process.env.PR_NUMBER;
if (!prNumber) {
	console.error("PR_NUMBER environment variable is required");
	process.exit(1);
}

const dbName = `cloudflare-worker-app-db-pr-${prNumber}`;

// Get database ID
let db: { name: string; uuid: string } | undefined;
try {
	const listResult = await $`bun wrangler d1 list --json`.quiet();
	const databases = JSON.parse(listResult.stdout.toString());
	db = databases.find((d: { name: string }) => d.name === dbName);

	if (!db) {
		console.error("Error: Database not found");
		process.exit(1);
	}
} catch (error) {
	console.error("Failed to list databases:", error);
	process.exit(1);
}

// Output for GitHub Actions
const githubOutput = process.env.GITHUB_OUTPUT;
if (githubOutput && db) {
	const file = Bun.file(githubOutput);
	const existing = (await file.exists()) ? await file.text() : "";
	await Bun.write(githubOutput, `${existing}database_id=${db.uuid}\ndatabase_name=${dbName}\n`);
}
