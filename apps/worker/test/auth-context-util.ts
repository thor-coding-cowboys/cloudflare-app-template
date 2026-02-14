import { env } from "cloudflare:test";
import { randEmail, randFullName } from "@ngneat/falso";
import { eq } from "drizzle-orm";
import { getDb } from "../src/db";
import { user } from "../src/features/auth/auth-schema";
import { createAuth } from "../src/features/auth/better-auth";

export interface UserInput {
	email?: string;
	password?: string;
	name?: string;
}

export interface AuthContext {
	sessionToken: string;
	user: UserInput & { id: string; email: string; password: string; name: string };
}

/**
 * Generate user input with defaults
 */
export function aUser(
	overrides: UserInput = {}
): UserInput & { email: string; password: string; name: string } {
	return {
		email: randEmail(),
		password: "password123",
		name: randFullName(),
		...overrides,
	};
}

/**
 * Helper to create auth headers with session token
 */
export function authHeaders(sessionToken: string): Record<string, string> {
	return {
		Cookie: `better-auth.session_token=${sessionToken}`,
	};
}

/**
 * Create an authenticated user context
 */
export async function createAuthContext(options: { user?: UserInput } = {}): Promise<AuthContext> {
	const db = getDb(env.DB);
	const auth = createAuth({
		db,
		betterAuthSecret: env.BETTER_AUTH_SECRET,
	});

	const userInput = aUser(options.user);

	// Sign up a test user
	const { headers } = await auth.api.signUpEmail({
		body: userInput,
		returnHeaders: true,
	});

	const cookies = headers.get("set-cookie");
	const token = cookies?.match(/better-auth\.session_token=([^;]+)/)?.[1];
	if (!token) throw new Error("No session token in response");
	const sessionToken = token;

	// Fetch the created user to get their ID
	const [createdUser] = await db.select().from(user).where(eq(user.email, userInput.email));
	if (!createdUser) throw new Error("Failed to fetch created user");

	return {
		sessionToken,
		user: {
			...userInput,
			id: createdUser.id,
		},
	};
}

/**
 * Create an authenticated user
 */
export async function createUser(overrides: UserInput = {}): Promise<{
	sessionToken: string;
	user: UserInput & { id: string; email: string; password: string; name: string };
}> {
	return createAuthContext({ user: overrides });
}
