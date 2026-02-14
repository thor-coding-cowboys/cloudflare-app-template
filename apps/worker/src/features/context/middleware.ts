import { createMiddleware } from "hono/factory";
import { getDb } from "../../db";
import { createAuth } from "../auth/better-auth";
import { HTTPException } from "hono/http-exception";
import { EnforcedAuthHonoEnv, HonoEnv } from "./hono-env";

export const contextMiddleware = createMiddleware<HonoEnv>(async (c, next) => {
	const { DB, BETTER_AUTH_SECRET: betterAuthSecret } = c.env;
	const db = getDb(DB);

	const origin =
		c.req.header("origin") ||
		`${c.req.header("x-forwarded-proto") || "https"}://${c.req.header("host") || "localhost"}`;

	const auth = createAuth({
		db,
		betterAuthSecret,
		origin,
	});
	c.set("db", db);
	c.set("betterAuth", auth);

	await next();
});

export const enforceAuthMiddleware = createMiddleware<EnforcedAuthHonoEnv>(async (c, next) => {
	const betterAuth = c.get("betterAuth");
	const session = await betterAuth.api.getSession({
		headers: c.req.raw.headers,
	});

	if (!session?.user || !session?.session) {
		throw new HTTPException(401, { message: "Unauthorized" });
	}

	c.set("authentication", session);

	await next();
});
