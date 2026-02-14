#!/usr/bin/env bun

import { $ } from "bun";

const isMain = process.env.GITHUB_REF === "refs/heads/main";

if (isMain) {
	console.log("Skipping clean history check on main branch");
	process.exit(0);
}

try {
	// Check commit count
	const commitCountResult = await $`git rev-list --count origin/main..HEAD`.quiet();
	const commitCount = parseInt(commitCountResult.stdout.toString().trim(), 10);

	if (commitCount !== 1) {
		console.error(
			`❌ Error: Branch must have exactly 1 commit ahead of main, but has ${commitCount} commits`
		);
		const logResult = await $`git log origin/main..HEAD --oneline`.quiet();
		console.error(logResult.stdout.toString());
		process.exit(1);
	}

	// Check for merge commits
	const mergeCommitsResult = await $`git log --merges origin/main..HEAD --oneline`.quiet();
	const mergeCommits = mergeCommitsResult.stdout.toString().trim();

	if (mergeCommits) {
		console.error("❌ Error: Merge commits are not allowed");
		console.error(mergeCommits);
		process.exit(1);
	}

	console.log("✅ Branch has exactly 1 commit and no merge commits");
} catch (error) {
	console.error("Failed to check git history:", error);
	process.exit(1);
}
