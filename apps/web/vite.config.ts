import { fileURLToPath } from "node:url";
import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
			routesDirectory: "./src/routes",
			generatedRouteTree: "./src/routeTree.gen.ts",
		}),
		viteReact(),
		tailwindcss(),
		cloudflare({
			persistState: {
				path: "../../.db/local",
			},
			configPath: "../worker/wrangler.jsonc",
		}),
	],
	resolve: {
		alias: {
			"@": fileURLToPath(new URL("./src", import.meta.url)),
			"@coding-cowboys/cloudflare-worker-app-worker": fileURLToPath(
				new URL("../worker/src", import.meta.url)
			),
		},
	},
	build: {
		outDir: "dist",
	},
	server: {
		host: true, // Bind to all interfaces (0.0.0.0) to allow access from other devices
		port: 5173,
	},
});
