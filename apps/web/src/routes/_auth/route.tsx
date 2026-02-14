import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { fetchSessionForRoute } from "@/hooks/useSession";

export const Route = createFileRoute("/_auth")({
	component: LayoutComponent,
	beforeLoad: async ({ context }) => {
		const session = await fetchSessionForRoute(context.queryClient);
		if (session?.session) {
			throw redirect({ to: "/todos" });
		}
	},
});

function LayoutComponent() {
	return (
		<div className="flex min-h-screen w-full flex-col">
			<div className="flex flex-1 items-center justify-center p-4">
				<Outlet />
			</div>
			<div className="bg-blue-50/50 border-t border-blue-100 px-4 py-3 text-center backdrop-blur-sm dark:bg-blue-950/20 dark:border-blue-900/30">
				<p className="text-sm text-blue-800 dark:text-blue-200 max-w-2xl mx-auto">
					Please note: This template is currently under active development. Data may be reset or
					removed during updates. We appreciate your understanding.
				</p>
			</div>
		</div>
	);
}
