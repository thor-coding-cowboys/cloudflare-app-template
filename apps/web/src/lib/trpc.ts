import type { TRPCRouter } from "@coding-cowboys/cloudflare-worker-app-worker/trpc";
import { createTRPCClient, httpLink, httpSubscriptionLink, splitLink } from "@trpc/client";
import type { inferRouterOutputs } from "@trpc/server";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import superjson from "superjson";

export const { TRPCProvider, useTRPC } = createTRPCContext<TRPCRouter>();

export type RouterOutput = inferRouterOutputs<TRPCRouter>;

export const trpcClient = createTRPCClient<TRPCRouter>({
	links: [
		splitLink({
			condition: (op) => op.type === "subscription",
			true: httpSubscriptionLink({
				transformer: superjson,
				url: "/api/trpc",
			}),
			false: httpLink({
				transformer: superjson,
				url: "/api/trpc",
			}),
		}),
	],
});

export type TRPCClient = typeof trpcClient;
