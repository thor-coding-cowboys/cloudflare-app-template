#!/usr/bin/env bun

import { $ } from "bun";

const workerName = process.env.WORKER_NAME;

if (!workerName) {
	console.error("WORKER_NAME environment variable is required");
	process.exit(1);
}

// Generate random secret (32 bytes = 64 hex chars)
const crypto = globalThis.crypto;
const randomBytes = new Uint8Array(32);
crypto.getRandomValues(randomBytes);
const secret = Array.from(randomBytes, (byte) => byte.toString(16).padStart(2, "0")).join("");

// Set BETTER_AUTH_SECRET
// Use printf to send confirmation 'y' and secret value to handle overwrites
console.log(`Setting BETTER_AUTH_SECRET for ${workerName}`);
try {
	await $`printf "y\n%s" ${secret} | bun wrangler secret put BETTER_AUTH_SECRET --name ${workerName}`;
	console.log("BETTER_AUTH_SECRET set successfully");
} catch (error) {
	console.error("Failed to set BETTER_AUTH_SECRET:", error);
	process.exit(1);
}
