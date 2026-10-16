#!/usr/bin/env bun
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

const LINTABLE = /\.(?:c|m)?[jt]sx?$/;

const repoRoot = spawnSync("git", ["rev-parse", "--show-toplevel"]).stdout.toString().trim();

function bin(name: string): string {
	const local = join(repoRoot, "node_modules", ".bin", name);
	return existsSync(local) ? local : name;
}

const staged = spawnSync("git", ["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"])
	.stdout.toString()
	.split("\0")
	.filter(Boolean);

if (staged.length === 0) process.exit(0);

const fmt = spawnSync(bin("oxfmt"), ["--check", "--no-error-on-unmatched-pattern", ...staged], {
	stdio: "inherit",
});
if (fmt.status !== 0) {
	console.error("\npre-commit: formatting check failed on staged files. Run `bun fmt` to fix.");
	process.exit(1);
}

const lintable = staged.filter((file) => LINTABLE.test(file));
if (lintable.length > 0) {
	const lint = spawnSync(bin("oxlint"), lintable, { stdio: "inherit" });
	if (lint.status !== 0) {
		console.error("\npre-commit: lint check failed on staged files. Run `bun lint` to fix.");
		process.exit(1);
	}
}
