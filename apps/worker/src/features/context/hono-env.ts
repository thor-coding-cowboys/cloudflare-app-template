import { betterAuth } from "better-auth";
import { getDb } from "../../db";
import { AuthType } from "../auth";

export type HonoEnv = {
	Bindings: Env;
	Variables: {
		db: ReturnType<typeof getDb>;
		betterAuth: ReturnType<typeof betterAuth>;
		authentication?: AuthType;
	};
};

export type EnforcedAuthHonoEnv = HonoEnv & {
	Variables: {
		db: ReturnType<typeof getDb>;
		betterAuth: ReturnType<typeof betterAuth>;
		authentication: AuthType;
	};
};

export { contextMiddleware } from "./middleware";
