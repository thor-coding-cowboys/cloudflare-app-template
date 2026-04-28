import type { ComponentType, SVGProps } from "react";
import {
	CloudIcon,
	CircleStackIcon,
	Squares2X2Icon,
	Square2StackIcon,
	LockClosedIcon,
	ServerIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type HeroiconComponent = ComponentType<SVGProps<SVGSVGElement>>;

interface FeatureCardProps {
	icon: HeroiconComponent;
	title: string;
	description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
	return (
		<div className="rounded-xl border bg-card text-card-foreground shadow">
			<div className="flex flex-col space-y-1.5 p-6">
				<Icon className="h-8 w-8 text-primary" />
				<h3 className="font-semibold leading-none tracking-tight">{title}</h3>
			</div>
			<div className="p-6 pt-0">
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
		</div>
	);
}

export interface LandingPageProps {
	baseUrl?: string;
}

export function LandingPage({ baseUrl = "" }: LandingPageProps) {
	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted">
			<div className="container mx-auto px-4 py-24">
				<div className="max-w-3xl mx-auto text-center mb-16">
					<Badge variant="secondary" className="mb-4">
						Open Source Template
					</Badge>
					<h1 className="text-5xl font-bold tracking-tight mb-6">
						Build Apps Faster
						<br />
						<span className="text-primary">With Modern Tools</span>
					</h1>
					<p className="text-xl text-muted-foreground mb-8">
						A production-ready template combining the best tools for full-stack development. Get
						started in minutes with type-safe APIs and beautiful UI components.
					</p>
					<div className="flex flex-wrap justify-center gap-4">
						<a
							href="https://github.com/thor-coding-cowboys/cloudflare-worker-app"
							target="_blank"
							rel="noopener noreferrer"
						>
							<Button className="h-10 px-8">See on GitHub</Button>
						</a>
						<a href={`${baseUrl}/todos`}>
							<Button variant="outline" className="h-10 px-8">
								tRPC Example
							</Button>
						</a>
						<a href={`${baseUrl}/todos-hono`}>
							<Button variant="outline" className="h-10 px-8">
								Hono Example
							</Button>
						</a>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<FeatureCard
						icon={CloudIcon}
						title="Cloudflare Workers"
						description="Edge-deployed serverless functions with global distribution and low latency"
					/>
					<FeatureCard
						icon={ServerIcon}
						title="Hono + tRPC"
						description="Fast edge framework with type-safe APIs"
					/>
					<FeatureCard
						icon={LockClosedIcon}
						title="Better Auth"
						description="Complete authentication solution with multiple providers"
					/>
					<FeatureCard
						icon={Square2StackIcon}
						title="React + TanStack"
						description="Modern React with TanStack Router for type-safe routing"
					/>
					<FeatureCard
						icon={Squares2X2Icon}
						title="shadcn/ui + Tailwind"
						description="Beautiful, accessible UI components styled with utility-first CSS"
					/>
					<FeatureCard
						icon={CircleStackIcon}
						title="D1 + Drizzle ORM"
						description="Cloudflare's edge database with a type-safe SQL-like ORM"
					/>
				</div>
			</div>
		</div>
	);
}
