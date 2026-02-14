import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { SignUpForm } from "@/components/auth/sign-up-form";

const authSearchSchema = z.object({
	redirect: z.string().optional(),
	error: z.string().optional(),
});

export const Route = createFileRoute("/_auth/auth/sign-up")({
	component: RouteComponent,
	validateSearch: zodValidator(authSearchSchema),
});

function RouteComponent() {
	const search = Route.useSearch();
	return <SignUpForm callbackURL={search.redirect} error={search.error} />;
}
