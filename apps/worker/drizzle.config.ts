import { defineConfig } from "drizzle-kit";

export default defineConfig({
	out: "./migrations",
	schema: "./src/db/schema.ts",
	dialect: "sqlite",
	driver: process.env.DATABASE_URL ? undefined : "d1-http",
	dbCredentials: process.env.DATABASE_URL
		? {
				url: process.env.DATABASE_URL,
			}
		: {
				accountId: process.env.CLOUDFLARE_ACCOUNT_ID ?? "",
				databaseId: process.env.CLOUDFLARE_DATABASE_ID ?? "",
				token: process.env.CLOUDFLARE_D1_TOKEN ?? "",
			},
});
