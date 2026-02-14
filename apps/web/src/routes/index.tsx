import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Cloud, Database, Layers, Layout, Lock, LucideIcon, Server } from "lucide-react";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

interface FeatureCardProps {
	icon: LucideIcon;
	title: string;
	description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
	return (
		<Card>
			<CardHeader>
				<Icon className="h-8 w-8 text-primary" />
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<CardDescription>{description}</CardDescription>
			</CardContent>
		</Card>
	);
}

function RouteComponent() {
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
							<Button size="lg">See on GitHub</Button>
						</a>
						<Link to="/todos">
							<Button size="lg" variant="outline">
								Go to todos example
							</Button>
						</Link>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<FeatureCard
						icon={Cloud}
						title="Cloudflare Workers"
						description="Edge-deployed serverless functions with global distribution and low latency"
					/>
					<FeatureCard
						icon={Server}
						title="Hono + tRPC"
						description="Fast edge framework with type-safe APIs"
					/>
					<FeatureCard
						icon={Lock}
						title="Better Auth"
						description="Complete authentication solution with multiple providers"
					/>
					<FeatureCard
						icon={Layout}
						title="React + TanStack"
						description="Modern React with TanStack Router for type-safe routing"
					/>
					<FeatureCard
						icon={Layers}
						title="shadcn/ui + Tailwind"
						description="Beautiful, accessible UI components styled with utility-first CSS"
					/>
					<FeatureCard
						icon={Database}
						title="D1 + Drizzle ORM"
						description="Cloudflare's edge database with a type-safe SQL-like ORM"
					/>
				</div>
			</div>
		</div>
	);
}
