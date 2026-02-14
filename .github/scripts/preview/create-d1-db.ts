#!/usr/bin/env bun

import { $ } from "bun";

const prNumber = process.env.PR_NUMBER;
if (!prNumber) {
	console.error("PR_NUMBER environment variable is required");
	process.exit(1);
}

const dbName = `cloudflare-worker-app-db-pr-${prNumber}`;

// Check if database already exists
try {
	const listResult = await $`bun wrangler d1 list --json`.quiet();
	const databases = JSON.parse(listResult.stdout.toString());
	const dbExists = databases.find((db: { name: string }) => db.name === dbName);

	if (dbExists) {
		console.log(`Database already exists: ${dbName}`);
	} else {
		console.log(`Creating database: ${dbName}`);
		await $`bun wrangler d1 create ${dbName}`.quiet();
	}
} catch (error) {
	console.error("Failed to list/create database:", error);
	process.exit(1);
}

// Output for GitHub Actions
const githubOutput = process.env.GITHUB_OUTPUT;
if (githubOutput) {
	const file = Bun.file(githubOutput);
	const existing = (await file.exists()) ? await file.text() : "";
	await Bun.write(githubOutput, `${existing}database_name=${dbName}\n`);
}
