import fs from "node:fs";
import path from "node:path";
import { defineWorkersConfig, readD1Migrations } from "@cloudflare/vitest-pool-workers/config";

const migrationsPath = path.join(__dirname, "./migrations");
const migrations = await readD1Migrations(migrationsPath);

// Read and modify wrangler config for tests
const wranglerPath = path.join(__dirname, "wrangler.jsonc");
const wranglerContent = fs.readFileSync(wranglerPath, "utf-8");
const wranglerConfig = JSON.parse(
	// Remove comments from JSONC
	wranglerContent.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*/g, "")
);

// Remove assets to avoid requiring frontend build
delete wranglerConfig.assets;

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
