import {
	ArrowRight01Icon,
	CloudServerIcon,
	Database01Icon,
	ShieldKeyIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Link, useShared } from "@void/react";
import { Badge } from "../src/components/ui/badge";
import { buttonVariants } from "../src/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card";

const FEATURES = [
	{
		icon: CloudServerIcon,
		title: "Cloudflare Workers",
		description: "Server-rendered React pages and file-based API routes on the edge.",
	},
	{
		icon: Database01Icon,
		title: "D1 + Drizzle",
		description: "Typed queries in one Worker, with migrations applied on deploy.",
	},
	{
		icon: ShieldKeyIcon,
		title: "Better Auth",
		description: "Email and password sessions without hand-written auth wiring.",
	},
];

export default function HomePage() {
	const { auth } = useShared();

	return (
		<div className="flex flex-col gap-10">
			<section className="py-10 text-center">
				<Badge variant="secondary" className="mb-4">
					Void + Cloudflare
				</Badge>
				<h1 className="font-heading mb-5 text-4xl font-bold tracking-tight text-balance sm:text-5xl">
					Build apps faster
					<br />
					<span className="text-primary">on the edge</span>
				</h1>
				<p className="text-muted-foreground mx-auto mb-8 max-w-xl text-base text-pretty">
					A Void starter with server-rendered pages, D1, and Better Auth. Everything runs in one
					Worker on your Cloudflare account.
				</p>
				<div className="flex flex-wrap justify-center gap-3">
					{auth.user ? (
						<Link href="/todos" className={buttonVariants({ size: "lg", className: "px-6" })}>
							Go to your todos
							<HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
						</Link>
					) : (
						<>
							<Link href="/sign-up" className={buttonVariants({ size: "lg", className: "px-6" })}>
								Create an account
								<HugeiconsIcon icon={ArrowRight01Icon} data-icon="inline-end" />
							</Link>
							<Link
								href="/sign-in"
								className={buttonVariants({ variant: "outline", size: "lg", className: "px-6" })}
							>
								Sign in
							</Link>
						</>
					)}
				</div>
			</section>

			<section className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{FEATURES.map((feature) => (
					<Card key={feature.title}>
						<CardHeader>
							<HugeiconsIcon icon={feature.icon} className="text-primary mb-1 size-8" />
							<CardTitle>{feature.title}</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="text-muted-foreground">{feature.description}</p>
						</CardContent>
					</Card>
				))}
			</section>
		</div>
	);
}
