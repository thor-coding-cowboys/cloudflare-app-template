import type { AppType } from "@coding-cowboys/cloudflare-worker-app-worker/rpc";
import { hc, parseResponse, DetailedError } from "hono/client";

export const honoClient = hc<AppType>("/", {
	init: {
		credentials: "include",
	},
});

export { parseResponse, DetailedError };
