import { initTRPC, TRPCError } from "@trpc/server";
import type { betterAuth } from "better-auth";
import superjson from "superjson";
import type { getDb } from "../db";
import { AuthType } from "../features/auth";
import { HonoEnv } from "../features/context";

interface BaseContext {
	authentication?: AuthType;
	db: ReturnType<typeof getDb>;
	betterAuth: ReturnType<typeof betterAuth>;
	env: HonoEnv["Bindings"];
}

const t = initTRPC.context<BaseContext>().create({
	transformer: superjson,
});

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
	if (!ctx.authentication?.user) {
		throw new TRPCError({ code: "UNAUTHORIZED" });
	}
	return next({ ctx: { ...ctx, authentication: ctx.authentication } });
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
