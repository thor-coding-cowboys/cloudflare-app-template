#!/usr/bin/env bun
import { spawnSync } from "node:child_process";
import { chmod, copyFile, mkdir, rm, symlink } from "node:fs/promises";
import { join, resolve } from "node:path";

const repoRoot = resolve(import.meta.dir, "../..");
const target = join(import.meta.dir, "pre-commit.ts");

const result = spawnSync("git", ["-C", repoRoot, "rev-parse", "--git-path", "hooks"]);
if (result.status !== 0) process.exit(0);

const hooksDir = resolve(repoRoot, result.stdout.toString().trim());
await mkdir(hooksDir, { recursive: true });

const hookPath = join(hooksDir, "pre-commit");
await rm(hookPath, { force: true });

try {
	await symlink(target, hookPath);
} catch {
	await copyFile(target, hookPath);
	await chmod(hookPath, 0o755);
}

console.log(`Installed git pre-commit hook -> ${target}`);
