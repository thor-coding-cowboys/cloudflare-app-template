/**
 * The auth instance should not be used directly in the application code.
 *
 * It is used when generating schema for better-auth, as it needs to be able to import the auth configuration,
 * but we don't want to import the entire middleware file which imports a lot of other things that are not needed for schema generation.
 *
 * bunx @better-auth/cli@latest generate --config app/worker/src/better-auth-client-config.ts
 */

import { getDb } from "../../db";
import { createAuth } from "./better-auth";

export const auth = createAuth({
	db: undefined as unknown as ReturnType<typeof getDb>,
	betterAuthSecret: "",
});

export type AuthType = {
	user: typeof auth.$Infer.Session.user;
	session: typeof auth.$Infer.Session.session;
};
