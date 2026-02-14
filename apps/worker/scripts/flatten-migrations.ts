import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const getMigrationsDir = () => {
	// find repository root using git rev parse --show-toplevel
	const gitRoot = (() => {
		const { execSync } = require("child_process");
		return execSync("git rev-parse --show-toplevel").toString().trim();
	})();

	return join(gitRoot, "apps", "worker", "migrations");
};

const migrationsDir = getMigrationsDir();
// Get all migration folders (sorted by timestamp)
const folders = readdirSync(migrationsDir, { withFileTypes: true })
	.filter((dirent) => dirent.isDirectory())
	.map((dirent) => dirent.name)
	.sort();

console.log(`Found ${folders.length} migration folders`);

// Flatten each migration
folders.forEach((folder, index) => {
	const sqlPath = join(migrationsDir, folder, "migration.sql");

	if (!existsSync(sqlPath)) {
		console.log(`⚠️  Skipping ${folder} - no migration.sql found`);
		return;
	}

	const sql = readFileSync(sqlPath, "utf-8");
	const paddedIndex = String(index).padStart(4, "0");
	const outputPath = join(migrationsDir, `${paddedIndex}_${folder}.sql`);

	writeFileSync(outputPath, sql);
	console.log(`✅ Created ${outputPath}`);
});

console.log("✨ Migrations flattened successfully!");
