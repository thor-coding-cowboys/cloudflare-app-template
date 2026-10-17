#!/usr/bin/env bun
/**
 * CI script: Check whether a preview environment exists for a PR
 * Sentinel: the preview D1 database, which is created first during deploy
 * Used by the preview cleanup workflow to only clean up when needed
 */

import { $ } from "bun";
import { APP_NAME } from "../common";

const prNumber = process.env.PR_NUMBER;
if (!prNumber) {
	console.error("PR_NUMBER environment variable is required");
	process.exit(1);
}

const dbName = `${APP_NAME}-db-pr-${prNumber}`;

let exists = false;
try {
	const listResult = await $`bun wrangler d1 list --json`.quiet();
	const databases = JSON.parse(listResult.stdout.toString()) as { name: string }[];
	exists = databases.some((db) => db.name === dbName);
} catch (error) {
	console.error("Failed to list databases:", error);
	process.exit(1);
}

const githubOutput = process.env.GITHUB_OUTPUT;
if (githubOutput) {
	const file = Bun.file(githubOutput);
	const existing = (await file.exists()) ? await file.text() : "";
	await Bun.write(githubOutput, `${existing}exists=${exists}\n`);
}

console.log(
	exists
		? `Preview environment found for PR #${prNumber} (${dbName})`
		: `No preview environment for PR #${prNumber}, nothing to clean up`
);
