import type { TRPCRouter } from "@coding-cowboys/cloudflare-worker-app-worker/trpc";
import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { ThemeSwitcher } from "@/components/theme-switcher";

export type RouterContext = {
	queryClient: QueryClient;
	trpc: TRPCOptionsProxy<TRPCRouter>;
};

export const Route = createRootRouteWithContext<RouterContext>()({
	component: () => (
		<div className="min-h-screen flex flex-col">
			<header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
				<div className="container mx-auto flex h-12 items-center justify-between px-4">
					<Link to="/" className="text-sm font-semibold tracking-tight">
						Cloudflare App Template
					</Link>
					<ThemeSwitcher />
				</div>
			</header>
			<main className="flex-1">
				<Outlet />
			</main>
			<TanStackRouterDevtools position="bottom-right" />
		</div>
	),
});
