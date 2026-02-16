#!/usr/bin/env bun

import { $ } from "bun";
import { APP_NAME } from "../common";

const prNumber = process.env.PR_NUMBER;
if (!prNumber) {
	console.error("PR_NUMBER environment variable is required");
	process.exit(1);
}

const workerName = `${APP_NAME}-pr-${prNumber}`;

try {
	console.log(`Deleting worker: ${workerName}`);
	await $`bun wrangler delete --name ${workerName} --force`.quiet();
	console.log("Worker deleted successfully");
} catch {
	console.log("Failed to delete worker, it may not exist");
}
