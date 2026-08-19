import { getDb } from "../../db";
import { AuthType, auth } from "../auth";

export type HonoEnv = {
	Bindings: Env;
	Variables: {
		db: ReturnType<typeof getDb>;
		betterAuth: typeof auth;
		authentication?: AuthType;
	};
};

export type EnforcedAuthHonoEnv = HonoEnv & {
	Variables: {
		db: ReturnType<typeof getDb>;
		betterAuth: typeof auth;
		authentication: AuthType;
	};
};

export { contextMiddleware } from "./middleware";
