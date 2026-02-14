import { trpcServer as honoTrpcServer } from "@hono/trpc-server";
import type { Context } from "hono";
import { router } from "../trpc-router";
import { HonoEnv } from "../features/context";

export const trpcServer = honoTrpcServer({
	router,
	createContext: async (_opts, c: Context<HonoEnv>) => {
		const betterAuth = c.get("betterAuth");
		const authentication = await betterAuth.api.getSession({
			headers: c.req.raw.headers,
		});
		return {
			authentication,
			db: c.get("db"),
			betterAuth,
			env: c.env,
		};
	},
});
