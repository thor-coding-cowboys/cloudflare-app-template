import type { ComponentType, SVGProps } from "react";
import {
	CloudIcon,
	CircleStackIcon,
	Squares2X2Icon,
	Square2StackIcon,
	LockClosedIcon,
	ServerIcon,
} from "@heroicons/react/24/outline";
import { createElement } from "react";

type HeroiconComponent = ComponentType<SVGProps<SVGSVGElement>>;

interface FeatureCardProps {
	icon: HeroiconComponent;
	title: string;
	description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
	return createElement(
		"div",
		{ className: "rounded-xl border bg-card text-card-foreground shadow" },
		createElement(
			"div",
			{ className: "flex flex-col space-y-1.5 p-6" },
			createElement(Icon, { className: "h-8 w-8 text-primary" }),
			createElement("h3", { className: "font-semibold leading-none tracking-tight" }, title)
		),
		createElement(
			"div",
			{ className: "p-6 pt-0" },
			createElement("p", { className: "text-sm text-muted-foreground" }, description)
		)
	);
}

export interface LandingPageProps {
	baseUrl?: string;
}

export function LandingPage({ baseUrl = "" }: LandingPageProps) {
	return createElement(
		"div",
		{ className: "min-h-screen bg-gradient-to-b from-background to-muted" },
		createElement(
			"div",
			{ className: "container mx-auto px-4 py-24" },
			createElement(
				"div",
				{ className: "max-w-3xl mx-auto text-center mb-16" },
				createElement(
					"div",
					{
						className:
							"inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 mb-4",
					},
					"Open Source Template"
				),
				createElement(
					"h1",
					{ className: "text-5xl font-bold tracking-tight mb-6" },
					"Build Apps Faster",
					createElement("br", null),
					createElement("span", { className: "text-primary" }, "With Modern Tools")
				),
				createElement(
					"p",
					{ className: "text-xl text-muted-foreground mb-8" },
					"A production-ready template combining the best tools for full-stack development. Get started in minutes with type-safe APIs and beautiful UI components."
				),
				createElement(
					"div",
					{ className: "flex flex-wrap justify-center gap-4" },
					createElement(
						"a",
						{
							href: "https://github.com/thor-coding-cowboys/cloudflare-worker-app",
							target: "_blank",
							rel: "noopener noreferrer",
						},
						createElement(
							"button",
							{
								type: "button",
								className:
									"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8",
							},
							"See on GitHub"
						)
					),
					createElement(
						"a",
						{ href: `${baseUrl}/todos` },
						createElement(
							"button",
							{
								type: "button",
								className:
									"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 px-8",
							},
							"Go to todos example"
						)
					)
				)
			),
			createElement(
				"div",
				{
					className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
				},
				createElement(FeatureCard, {
					icon: CloudIcon,
					title: "Cloudflare Workers",
					description:
						"Edge-deployed serverless functions with global distribution and low latency",
				}),
				createElement(FeatureCard, {
					icon: ServerIcon,
					title: "Hono + tRPC",
					description: "Fast edge framework with type-safe APIs",
				}),
				createElement(FeatureCard, {
					icon: LockClosedIcon,
					title: "Better Auth",
					description: "Complete authentication solution with multiple providers",
				}),
				createElement(FeatureCard, {
					icon: Square2StackIcon,
					title: "React + TanStack",
					description: "Modern React with TanStack Router for type-safe routing",
				}),
				createElement(FeatureCard, {
					icon: Squares2X2Icon,
					title: "shadcn/ui + Tailwind",
					description: "Beautiful, accessible UI components styled with utility-first CSS",
				}),
				createElement(FeatureCard, {
					icon: CircleStackIcon,
					title: "D1 + Drizzle ORM",
					description: "Cloudflare's edge database with a type-safe SQL-like ORM",
				})
			)
		)
	);
}
