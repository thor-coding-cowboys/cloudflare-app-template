/// <reference path="../worker-configuration.d.ts" />
import "vitest/globals";
import type { D1Migration } from "@cloudflare/vitest-pool-workers/config";

declare module "cloudflare:test" {
	// ProvidedEnv controls the type of `import("cloudflare:test").env`
	interface ProvidedEnv extends Env {
		TEST_MIGRATIONS: D1Migration[];
	}
}
