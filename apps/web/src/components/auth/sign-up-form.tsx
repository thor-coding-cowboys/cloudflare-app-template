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

const signUpSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Please enter a valid email address"),
	password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

interface SignUpFormProps {
	callbackURL?: string;
	error?: string;
}

export function SignUpForm({ callbackURL, error }: SignUpFormProps) {
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
	} = useForm<SignUpFormValues>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: SignUpFormValues) => {
		setApiError("");
		try {
			const { data, error } = await authClient.signUp.email({
				name: values.name,
				email: values.email,
				password: values.password,
			});

			if (error) {
				setApiError(error.message || "Failed to create account. Please try again.");
				return;
			}

			if (data) {
				const { error: signInError } = await authClient.signIn.email({
					email: values.email,
					password: values.password,
				});

				if (signInError) {
					void navigate({
						to: "/auth/sign-in",
						search: { redirect: callbackURL },
					});
					return;
				}

				await invalidateSession();
				void navigate({ to: callbackURL || "/todos" });
			} else {
				setApiError("Failed to create account. Please try again.");
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
				<CardTitle className="text-2xl">Sign Up</CardTitle>
				<CardDescription>Enter your information to create an account</CardDescription>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)}>
					<FieldGroup>
						<Field>
							<FieldLabel htmlFor="name">Name</FieldLabel>
							<Input
								id="name"
								type="text"
								placeholder="Name"
								disabled={isSubmitting}
								{...register("name")}
								onChange={(e) => {
									register("name").onChange(e);
									setApiError("");
								}}
							/>
							{errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
						</Field>
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								id="email"
								type="text"
								placeholder="m@example.com"
								autoComplete="email"
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
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<Input
								id="password"
								type="password"
								placeholder="Password"
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
							{isSubmitting ? "Creating account..." : "Create an account"}
						</Button>
					</FieldGroup>
				</form>

				<div className="mt-4 text-center text-sm text-muted-foreground">
					Already have an account?{" "}
					<Link
						to="/auth/sign-in"
						search={{ redirect: callbackURL }}
						className="text-primary hover:underline"
					>
						Sign In
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
