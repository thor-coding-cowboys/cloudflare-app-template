import { LandingPage } from "@coding-cowboys/cloudflare-worker-app-components";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <LandingPage />;
}
