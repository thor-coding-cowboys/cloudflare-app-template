import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useSessionInvalidate } from "@/hooks/useSession";

const signInSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(1, "Password is required"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

interface SignInFormProps {
	callbackURL?: string;
	error?: string;
}

export function SignInForm({ callbackURL, error }: SignInFormProps) {
	const navigate = useNavigate();
	const invalidateSession = useSessionInvalidate();
	const [apiError, setApiError] = useState<string>("");

	useEffect(() => {
		if (error) {
			setApiError("Authentication failed. Please try again.");
		}
	}, [error]);

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignInFormValues>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: SignInFormValues) => {
		setApiError("");
		try {
			const { data, error } = await authClient.signIn.email({
				email: values.email,
				password: values.password,
				callbackURL: callbackURL || "/todos",
			});

			if (error) {
				setApiError(error.message || "Failed to sign in. Please check your credentials.");
				return;
			}

			if (data) {
				await invalidateSession();
				navigate({ to: callbackURL || "/todos" });
			} else {
				setApiError("Failed to sign in. Please try again.");
			}
		} catch (err) {
			setApiError(
				err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
			);
		}
	};

	return (
		<Card className="w-full max-w-md border-border">
			<CardHeader>
				<CardTitle className="text-2xl">Sign In</CardTitle>
				<CardDescription>Enter your email below to login to your account</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								id="email"
								type="text"
								placeholder="m@example.com"
								autoComplete="username"
								disabled={isSubmitting}
								{...register("email")}
								onChange={(e) => {
									register("email").onChange(e);
									setApiError("");
								}}
							/>
							{errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
						</Field>
						<Field>
							<div className="flex items-center justify-between">
								<FieldLabel htmlFor="password">Password</FieldLabel>
							</div>
							<Input
								id="password"
								type="password"
								placeholder="Password"
								autoComplete="current-password"
								disabled={isSubmitting}
								{...register("password")}
								onChange={(e) => {
									register("password").onChange(e);
									setApiError("");
								}}
							/>
							{errors.password && (
								<p className="text-sm text-destructive">{errors.password.message}</p>
							)}
						</Field>
						{apiError && <p className="text-sm text-destructive">{apiError}</p>}
						<Button type="submit" className="w-full" disabled={isSubmitting}>
							{isSubmitting ? "Signing in..." : "Sign In"}
						</Button>
					</FieldGroup>
				</form>

				<div className="mt-4 text-center text-sm text-muted-foreground">
					Don't have an account?{" "}
					<Link
						to="/auth/sign-up"
						search={{ redirect: callbackURL }}
						className="text-primary hover:underline"
					>
						Sign Up
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
