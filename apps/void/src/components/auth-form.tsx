import { Link, useRouter } from "@void/react";
import { useState, type FormEvent } from "react";
import { auth } from "void/client";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [pending, setPending] = useState(false);

	const isSignUp = mode === "sign-up";

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setPending(true);
		setError(null);

		const result = isSignUp
			? await auth.signUp.email({ name, email, password })
			: await auth.signIn.email({ email, password });

		if (result.error) {
			setError(result.error.message ?? "Authentication failed");
			setPending(false);
			return;
		}

		setPending(false);
		await router.visit("/todos");
	}

	return (
		<Card className="mx-auto w-full max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">{isSignUp ? "Create your account" : "Sign In"}</CardTitle>
				<CardDescription>
					{isSignUp
						? "Enter your details below to create your account"
						: "Enter your email below to login to your account"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={onSubmit} noValidate>
					<FieldGroup>
						{isSignUp && (
							<Field>
								<FieldLabel htmlFor="name">Name</FieldLabel>
								<Input
									id="name"
									name="name"
									type="text"
									autoComplete="name"
									placeholder="Ada Lovelace"
									required
									disabled={pending}
									value={name}
									onChange={(event) => setName(event.target.value)}
								/>
							</Field>
						)}
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								id="email"
								name="email"
								type="email"
								autoComplete="username"
								placeholder="m@example.com"
								required
								disabled={pending}
								value={email}
								onChange={(event) => setEmail(event.target.value)}
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<Input
								id="password"
								name="password"
								type="password"
								autoComplete={isSignUp ? "new-password" : "current-password"}
								placeholder="Password"
								required
								minLength={8}
								disabled={pending}
								value={password}
								onChange={(event) => setPassword(event.target.value)}
							/>
							{isSignUp && <FieldDescription>Must be at least 8 characters long.</FieldDescription>}
						</Field>
						{error && <p className="text-destructive text-xs">{error}</p>}
						<Button type="submit" className="w-full" disabled={pending}>
							{pending ? "Please wait…" : isSignUp ? "Create account" : "Sign In"}
						</Button>
					</FieldGroup>
				</form>

				<div className="text-muted-foreground mt-4 text-center text-sm">
					{isSignUp ? (
						<>
							Already have an account?{" "}
							<Link href="/sign-in" className="text-primary hover:underline">
								Sign in
							</Link>
						</>
					) : (
						<>
							Don't have an account?{" "}
							<Link href="/sign-up" className="text-primary hover:underline">
								Sign up
							</Link>
						</>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
