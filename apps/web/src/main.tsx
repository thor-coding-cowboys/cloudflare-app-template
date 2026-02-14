import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { ThemeProvider } from "next-themes";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./index.css";
import { TRPCProvider, trpcClient } from "./lib/trpc";
import { queryClient } from "./lib/query-client";

// Create a new router instance
const router = createRouter({
	routeTree,
	context: {
		queryClient,
		trpc: createTRPCOptionsProxy({ queryClient, client: trpcClient }),
	},
	defaultPreload: "intent",
	scrollRestoration: true,
	defaultStructuralSharing: true,
	defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
					<QueryClientProvider client={queryClient}>
						<RouterProvider router={router} />
					</QueryClientProvider>
				</TRPCProvider>
			</ThemeProvider>
		</StrictMode>
	);
}
