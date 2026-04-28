#!/usr/bin/env bun

/**
 * Setup script for the Cloudflare App Template.
 *
 * Prompts for project-specific values and replaces template placeholders
 * across all files. Press enter to skip a prompt and keep the template default.
 *
 * Usage: bun run scripts/setup.ts
 */

import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { createInterface } from "node:readline";

// ── Template defaults (the values baked into the template) ──────────────

const DEFAULTS = {
	npmOrg: "coding-cowboys",
	appName: "cloudflare-worker-app",
	githubOrg: "thor-coding-cowboys",
	displayOrg: "Coding Cowboys",
	displayApp: "Cloudflare App Template",
	cfSubdomain: "coding-cowboys",
} as const;

// ── Prompt helper ───────────────────────────────────────────────────────

const rl = createInterface({ input: process.stdin, output: process.stdout });

function ask(question: string, hint: string): Promise<string> {
	return new Promise((resolve) => {
		rl.question(`${question} (${hint}, enter to keep): `, (answer) => {
			resolve(answer.trim());
		});
	});
}

// ── File walking ────────────────────────────────────────────────────────

const ROOT = join(import.meta.dir, "..");

const SKIP_DIRS = new Set(["node_modules", ".git", ".db", "dist", ".wrangler", ".tanstack"]);

const SKIP_FILES = new Set(["bun.lock", "setup.ts"]);

function walk(dir: string): string[] {
	const results: string[] = [];
	for (const entry of readdirSync(dir, { withFileTypes: true })) {
		if (SKIP_DIRS.has(entry.name)) continue;
		const fullPath = join(dir, entry.name);
		if (entry.isDirectory()) {
			results.push(...walk(fullPath));
		} else if (entry.isFile()) {
			if (SKIP_FILES.has(entry.name)) continue;
			results.push(fullPath);
		}
	}
	return results;
}

function isBinary(path: string): boolean {
	const ext = path.split(".").pop()?.toLowerCase() ?? "";
	return ["png", "jpg", "jpeg", "gif", "ico", "woff", "woff2", "ttf", "eot", "sqlite"].includes(
		ext
	);
}

// ── Main ────────────────────────────────────────────────────────────────

console.log("\nCloudflare App Template Setup\n");
console.log("This will replace template placeholders with your project values.");
console.log("Press enter to keep the current value.\n");

const npmOrg =
	(await ask(
		"Package scope prefix (before / in package.json names, without @)",
		`replaces @${DEFAULTS.npmOrg}, current: ${DEFAULTS.npmOrg}`
	)) || "";
const appName =
	(await ask("App name", `replaces ${DEFAULTS.appName}, current: ${DEFAULTS.appName}`)) || "";
const githubOrg =
	(await ask(
		"GitHub org or username (use your username if you have no org)",
		`replaces ${DEFAULTS.githubOrg}, current: ${DEFAULTS.githubOrg}`
	)) || "";
const displayOrg =
	(await ask(
		"Display org name",
		`replaces '${DEFAULTS.displayOrg}', current: ${DEFAULTS.displayOrg}`
	)) || "";
const displayApp =
	(await ask(
		"Display app name",
		`replaces '${DEFAULTS.displayApp}', current: ${DEFAULTS.displayApp}`
	)) || "";
const cfSubdomain =
	(await ask(
		"Cloudflare workers subdomain",
		`replaces ${DEFAULTS.cfSubdomain}, current: ${DEFAULTS.cfSubdomain}`
	)) || "";

rl.close();

// Build replacement pairs (old -> new), skip unchanged
const replacements: [string, string][] = [];

if (npmOrg) {
	replacements.push([`@${DEFAULTS.npmOrg}/`, `@${npmOrg}/`]);
}
if (appName) {
	// Must run after npmOrg replacement since app name is a substring of package names
	replacements.push([DEFAULTS.appName, appName]);
}
if (githubOrg) {
	replacements.push([DEFAULTS.githubOrg, githubOrg]);
}
if (displayOrg) {
	replacements.push([DEFAULTS.displayOrg, displayOrg]);
}
if (displayApp) {
	replacements.push([DEFAULTS.displayApp, displayApp]);
}
if (cfSubdomain) {
	// Replace in workers.dev URLs: <app>.<subdomain>.workers.dev
	replacements.push([`${DEFAULTS.cfSubdomain}.workers.dev`, `${cfSubdomain}.workers.dev`]);
}

if (replacements.length === 0) {
	console.log("\nNo changes requested. Exiting.");
	process.exit(0);
}

console.log("\nApplying replacements:\n");
for (const [from, to] of replacements) {
	console.log(`  ${from}  ->  ${to}`);
}
console.log();

const files = walk(ROOT);
let filesChanged = 0;

for (const filePath of files) {
	if (isBinary(filePath)) continue;

	let content: string;
	try {
		content = readFileSync(filePath, "utf-8");
	} catch {
		continue;
	}

	let updated = content;
	for (const [from, to] of replacements) {
		updated = updated.split(from).join(to);
	}

	if (updated !== content) {
		writeFileSync(filePath, updated);
		filesChanged++;
		console.log(`  updated: ${relative(ROOT, filePath)}`);
	}
}

console.log(`\nDone! Updated ${filesChanged} file(s).`);
console.log("\nNext steps:");
console.log("  1. Run `bun install` to update the lockfile");
console.log("  2. Create your D1 database: `bunx wrangler d1 create <your-app-name>`");
console.log("  3. Update the `database_id` in apps/worker/wrangler.jsonc");
console.log("  4. Set your auth secret: `bunx wrangler secret put BETTER_AUTH_SECRET`");
console.log("  5. Run `bun run dev` to verify everything works\n");
