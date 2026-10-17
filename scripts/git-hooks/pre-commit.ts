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

const staged = spawnSync("git", ["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"], {
	cwd: repoRoot,
})
	.stdout.toString()
	.split("\0")
	.filter(Boolean);

if (staged.length === 0) process.exit(0);

// oxfmt applies `.oxfmtrc.json` ignorePatterns only while walking directories, not
// when given explicit paths. Passing staged paths directly therefore reformats files
// the patterns exclude (shadcn components, generated `.void/` output, `dist/`).
// Listing the whole tree and keeping the staged files preserves both the ignore
// patterns and the staged-only scope. Exit code 1 with stdout means "would change".
const fmt = spawnSync(bin("oxfmt"), ["--list-different", "."], {
	cwd: repoRoot,
	encoding: "utf8",
});

if (fmt.error) {
	console.error(`pre-commit: failed to run oxfmt: ${fmt.error.message}`);
	process.exit(1);
}

const fmtReport = fmt.stderr.trim();
if (fmtReport) {
	console.error(fmtReport);
	console.error("\npre-commit: formatting check could not run.");
	process.exit(1);
}

const unformatted = new Set(
	fmt.stdout
		.split("\n")
		.map((line) => line.trim())
		.filter(Boolean)
);
const misformatted = staged.filter((file) => unformatted.has(file));

if (misformatted.length > 0) {
	console.error(`Format issues found in:\n${misformatted.map((file) => `  ${file}`).join("\n")}`);
	console.error("\npre-commit: formatting check failed on staged files. Run `bun fmt` to fix.");
	process.exit(1);
}

const lintable = staged.filter((file) => LINTABLE.test(file));
if (lintable.length > 0) {
	const lint = spawnSync(bin("oxlint"), lintable, { cwd: repoRoot, stdio: "inherit" });
	if (lint.status !== 0) {
		console.error("\npre-commit: lint check failed on staged files. Run `bun lint` to fix.");
		process.exit(1);
	}
}
