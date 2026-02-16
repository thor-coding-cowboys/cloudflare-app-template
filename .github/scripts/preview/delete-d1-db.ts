#!/usr/bin/env bun

import { $ } from "bun";
import { APP_NAME } from "../common";

const prNumber = process.env.PR_NUMBER;
if (!prNumber) {
	console.error("PR_NUMBER environment variable is required");
	process.exit(1);
}

const dbName = `${APP_NAME}-db-pr-${prNumber}`;

// Check if database exists
try {
	const listResult = await $`bun wrangler d1 list --json`.quiet();
	const databases = JSON.parse(listResult.stdout.toString());
	const dbExists = databases.find((db: { name: string }) => db.name === dbName);

	if (dbExists) {
		console.log(`Deleting database: ${dbName}`);
		await $`bun wrangler d1 delete ${dbName} --skip-confirmation`.quiet();
	} else {
		console.log(`Database not found: ${dbName}`);
	}
} catch {
	console.log("Failed to list databases, assuming database doesn't exist");
	process.exit(0);
}
