import type { TRPCRouter } from "@coding-cowboys/cloudflare-worker-app-worker/trpc";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";

export type RouterContext = {
	queryClient: QueryClient;
	trpc: TRPCOptionsProxy<TRPCRouter>;
};

export const Route = createRootRouteWithContext<RouterContext>()({
	component: () => (
		<>
			<Outlet />
			<TanStackRouterDevtools position="bottom-right" />
		</>
	),
});
