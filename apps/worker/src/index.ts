import { Hono } from "hono";

export { contextStorage } from "hono/context-storage";

import { contextStorage } from "hono/context-storage";
import { authRouter } from "./features/auth/auth-route";
import { todoRouter } from "./features/todo/todo-route";
import { trpcServer } from "./trpc/server";
import { contextMiddleware, enforceAuthMiddleware, HonoEnv } from "./features/context";

const app = new Hono<HonoEnv>()
	.use("*", contextStorage())
	.use("*", contextMiddleware)
	.route("/api/auth", authRouter)
	.use("/api/trpc/*", trpcServer)
	.use("/api/todo/*", enforceAuthMiddleware)
	.route("/api/todo", todoRouter)
	.use("*", enforceAuthMiddleware);

export default app;
