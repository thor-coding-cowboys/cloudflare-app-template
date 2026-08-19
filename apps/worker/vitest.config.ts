import fs from "node:fs";
import path from "node:path";
import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";
import { unstable_splitSqlQuery } from "wrangler";

const migrationsPath = path.join(__dirname, "./migrations");

function readNestedD1Migrations(dir: string) {
	const names = fs
		.readdirSync(dir, { withFileTypes: true })
		.filter((entry) => entry.isDirectory())
		.map((entry) => entry.name)
		.sort((a, b) => Number(a.split("_")[0]) - Number(b.split("_")[0]));
	return names
		.filter((name) => fs.existsSync(path.join(dir, name, "migration.sql")))
		.map((name) => ({
			name: `${name}/migration.sql`,
			queries: unstable_splitSqlQuery(
				fs.readFileSync(path.join(dir, name, "migration.sql"), "utf8")
			).filter((query) => query.replace(/--.*$/gm, "").trim().length > 0),
		}));
}

const migrations = readNestedD1Migrations(migrationsPath);

// Read and modify wrangler config for tests
const wranglerPath = path.join(__dirname, "wrangler.jsonc");
const wranglerContent = fs.readFileSync(wranglerPath, "utf-8");
const wranglerConfig = JSON.parse(
	// Remove comments from JSONC
	wranglerContent.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "")
);

// Remove assets to avoid requiring frontend build
delete wranglerConfig.assets;

// Remove migrations_dir/migrations_pattern; miniflare applies migrations via
// the TEST_MIGRATIONS binding (see test/apply-migrations.ts), not wrangler's
// built-in migrations handling.
delete wranglerConfig.d1_databases?.[0]?.migrations_dir;
delete wranglerConfig.d1_databases?.[0]?.migrations_pattern;

// Write temporary test config
const testConfigPath = path.join(__dirname, ".wrangler.test.json");
fs.writeFileSync(testConfigPath, JSON.stringify(wranglerConfig, null, 2));

export default defineWorkersConfig({
	test: {
		setupFiles: ["./test/apply-migrations.ts"],
		poolOptions: {
			workers: {
				singleWorker: true,
				wrangler: { configPath: testConfigPath },
				miniflare: {
					bindings: { TEST_MIGRATIONS: migrations },
					logLevel: "warn",
				},
			},
		},
	},
});
