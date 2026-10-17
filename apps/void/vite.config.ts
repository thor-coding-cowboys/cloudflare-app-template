import { voidReact } from "@void/react/plugin";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { voidPlugin } from "void";

export default defineConfig({
	plugins: [voidPlugin(), voidReact({ react: { compiler: true } }), tailwindcss()],
	server: {
		host: true,
		port: 5174,
	},
});
