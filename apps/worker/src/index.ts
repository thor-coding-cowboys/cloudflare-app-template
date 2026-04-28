import { Hono } from "hono";

export { contextStorage } from "hono/context-storage";

import { contextStorage } from "hono/context-storage";
import { authRouter } from "./features/auth/auth-route";
import { todoRouter } from "./features/todo/todo-route";
import { trpcServer } from "./trpc/server";
import { contextMiddleware, HonoEnv } from "./features/context";

const app = new Hono<HonoEnv>()
	.use("*", contextStorage())
	.use("*", contextMiddleware)
	.route("/api/auth", authRouter)
	.use("/api/trpc/*", trpcServer)
	.route("/api/todo", todoRouter)
	.get("*", async (c) => {
		try {
			if (c.env.ASSETS) {
				const res = await c.env.ASSETS.fetch(c.req.raw);
				if (res.ok) return res;
			}
		} catch {
			// ASSETS unavailable in dev
		}
		return c.notFound();
	});

export default app;
