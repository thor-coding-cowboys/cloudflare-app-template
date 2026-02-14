import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import { z } from "zod";
import { SignInForm } from "@/components/auth/sign-in-form";

const authSearchSchema = z.object({
	redirect: z.string().optional(),
	error: z.string().optional(),
});

export const Route = createFileRoute("/_auth/auth/sign-in")({
	component: RouteComponent,
	validateSearch: zodValidator(authSearchSchema),
});

function RouteComponent() {
	const search = Route.useSearch();
	return <SignInForm callbackURL={search.redirect} error={search.error} />;
}
