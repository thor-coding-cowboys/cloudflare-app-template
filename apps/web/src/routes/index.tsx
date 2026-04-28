import { LandingPage } from "./-components/landing-page";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <LandingPage />;
}
