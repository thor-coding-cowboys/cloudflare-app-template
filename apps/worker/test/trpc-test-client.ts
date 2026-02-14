import { SELF } from "cloudflare:test";
import { createTRPCClient, httpLink } from "@trpc/client";
import superjson from "superjson";
import type { TRPCRouter } from "../src/trpc-router";

interface CreateTRPCTestClientOptions {
	sessionToken?: string;
	headers?: Record<string, string>;
}

/**
 * Create a TRPC client for testing
 * @param options - Optional session token and additional headers
 * @returns TRPC client instance
 *
 * @example
 * // Without authentication
 * const client = createTRPCTestClient();
 * await client.todo.list.query();
 *
 * @example
 * // With authentication
 * const ctx = await createAuthContext();
 * const client = createTRPCTestClient({ sessionToken: ctx.sessionToken });
 * await client.todo.create.mutate({ title: "Test Todo" });
 */
export function createTRPCTestClient(options: CreateTRPCTestClientOptions = {}) {
	const { sessionToken, headers: additionalHeaders = {} } = options;

	const headers: Record<string, string> = {
		...additionalHeaders,
	};

	if (sessionToken) {
		headers.Cookie = `better-auth.session_token=${sessionToken}`;
	}

	return createTRPCClient<TRPCRouter>({
		links: [
			httpLink({
				url: "http://example.com/api/trpc",
				headers,
				transformer: superjson,
				// Use SELF.fetch from Cloudflare Workers test environment
				fetch: (url, options) => SELF.fetch(url, options),
			}),
		],
	});
}

/**
 * Create headers object with session token for raw fetch requests
 * @param sessionToken - Session token
 * @returns Headers object
 *
 * @deprecated Use createTRPCTestClient instead for TRPC calls
 */
export function authHeaders(sessionToken: string): Record<string, string> {
	return {
		Cookie: `better-auth.session_token=${sessionToken}`,
	};
}
