import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const migrationsDir = join(__dirname, "..", "apps", "worker", "migrations");

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
