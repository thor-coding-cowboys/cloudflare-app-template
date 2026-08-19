#!/usr/bin/env bun

import { APP_NAME } from "../common";

const prNumber = process.env.PR_NUMBER;
const dbId = process.env.DB_ID;
const dbName = process.env.DB_NAME;

if (!prNumber || !dbId || !dbName) {
	console.error("PR_NUMBER, DB_ID, and DB_NAME environment variables are required");
	process.exit(1);
}

const workerName = `${APP_NAME}-pr-${prNumber}`;

// Read wrangler.jsonc from worker directory
const configPath = "apps/worker/wrangler.jsonc";
const configContent = await Bun.file(configPath).text();

// Parse JSONC (remove comments)
const jsonContent = configContent.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "");
const config = JSON.parse(jsonContent);

// Update config for preview deployment from root
config.name = workerName;
config.main = "./apps/worker/src/index.ts";
config.assets.directory = "./apps/web/dist/client";
config.d1_databases[0].database_id = dbId;
config.d1_databases[0].database_name = dbName;
config.d1_databases[0].migrations_dir = "./apps/worker/migrations";
config.d1_databases[0].migrations_pattern = "./apps/worker/migrations/*/migration.sql";

// Remove custom domain routes for preview
config.routes = undefined;

// Clear vars to avoid using production values in preview
// Preview-specific vars should be set via secrets or env in the workflow
config.vars = {};

// Write preview config
const previewConfigPath = "wrangler.preview.jsonc";
await Bun.write(previewConfigPath, JSON.stringify(config, null, "\t"));

// Output for GitHub Actions
const githubOutput = process.env.GITHUB_OUTPUT;
if (githubOutput) {
	const file = Bun.file(githubOutput);
	const existing = (await file.exists()) ? await file.text() : "";
	await Bun.write(githubOutput, `${existing}worker_name=${workerName}\n`);
}
