import { applyD1Migrations, env } from "cloudflare:test";

// applyD1Migrations() only applies migrations that haven't already been applied,
// therefore it is safe to call this function in the setup file.
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
