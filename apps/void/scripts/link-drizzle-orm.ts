/**
 * Void bundles drizzle-kit 0.31.x, which resolves `drizzle-orm` from bun's shared
 * isolated-install hoist directory (`node_modules/.bun/node_modules`). Another
 * workspace in this repo pins drizzle-orm v1, which wins that slot and fails
 * drizzle-kit's API-compatibility gate, so `void db generate` / `void deploy`
 * cannot start.
 *
 * Link the drizzle-orm that Void itself uses next to its drizzle-kit so the
 * resolution is deterministic. Idempotent; runs before every db command and on
 * `bun install` through the root `prepare` script.
 */
import { existsSync, readlinkSync, realpathSync, symlinkSync, unlinkSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const appDir = resolve(import.meta.dir, "..");

let ormTarget: string;
let kitDir: string;
try {
	// bun's isolated linker keeps a package's dependencies next to its own dir,
	// i.e. `node_modules/.bun/<pkg>@<version>/node_modules/<dep>`.
	const voidModules = dirname(realpathSync(join(appDir, "node_modules", "void")));
	ormTarget = realpathSync(join(voidModules, "drizzle-orm"));
	kitDir = realpathSync(join(voidModules, "drizzle-kit"));
} catch {
	// Not installed with bun's isolated linker; nothing to fix.
	process.exit(0);
}

const link = join(dirname(kitDir), "drizzle-orm");
const desired = relative(dirname(link), ormTarget);

try {
	if (readlinkSync(link) === desired) process.exit(0);
	unlinkSync(link);
} catch {
	if (existsSync(link)) process.exit(0);
}

try {
	symlinkSync(desired, link, "dir");
} catch (error) {
	console.warn(`[void] could not link drizzle-orm for drizzle-kit: ${String(error)}`);
}
