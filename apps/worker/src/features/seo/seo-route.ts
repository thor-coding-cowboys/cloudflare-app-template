import { Hono } from "hono";
import { renderToString } from "react-dom/server";
import { createElement } from "react";
import { LandingPage } from "@coding-cowboys/cloudflare-worker-app-components";
import type { HonoEnv } from "../context";

// Inlined CSS from the build - this is generated at build time and ensures
// the SSR landing page always has the correct styles regardless of asset hashes.
// This CSS includes all Tailwind utilities needed for the landing page.
const INLINE_CSS = `
/* Tailwind CSS v4 - inlined for SSR */
*, ::before, ::after { box-sizing: border-box; border-width: 0; border-style: solid; border-color: var(--border, #e2e8f0); }
::before, ::after { --tw-content: ''; }
html, :host { line-height: 1.5; -webkit-text-size-adjust: 100%; -moz-tab-size: 4; tab-size: 4; font-family: 'Figtree Variable', system-ui, sans-serif; font-feature-settings: normal; font-variation-settings: normal; -webkit-tap-highlight-color: transparent; }
body { margin: 0; line-height: inherit; background-color: var(--background, #fff); color: var(--foreground, #0f172a); }
hr { height: 0; color: inherit; border-top-width: 1px; }
abbr:where([title]) { text-decoration: underline dotted; }
h1, h2, h3, h4, h5, h6 { font-size: inherit; font-weight: inherit; }
a { color: inherit; text-decoration: inherit; }
b, strong { font-weight: bolder; }
code, kbd, samp, pre { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 1em; }
small { font-size: 80%; }
sub, sup { font-size: 75%; line-height: 0; position: relative; vertical-align: baseline; }
sub { bottom: -0.25em; }
sup { top: -0.5em; }
table { text-indent: 0; border-color: inherit; border-collapse: collapse; }
button, input, optgroup, select, textarea { font-family: inherit; font-feature-settings: inherit; font-variation-settings: inherit; font-size: 100%; font-weight: inherit; line-height: inherit; letter-spacing: inherit; color: inherit; margin: 0; padding: 0; }
button, select { text-transform: none; }
button, input:where([type='button']), input:where([type='reset']), input:where([type='submit']) { -webkit-appearance: button; background-color: transparent; background-image: none; }
:-moz-focusring { outline: auto; }
:-moz-ui-invalid { box-shadow: none; }
progress { vertical-align: baseline; }
::-webkit-inner-spin-button, ::-webkit-outer-spin-button { height: auto; }
[type='search'] { -webkit-appearance: textfield; outline-offset: -2px; }
::-webkit-search-decoration { -webkit-appearance: none; }
::-webkit-file-upload-button { -webkit-appearance: button; font: inherit; }
summary { display: list-item; }
blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre { margin: 0; }
fieldset { margin: 0; padding: 0; }
legend { padding: 0; }
ol, ul, menu { list-style: none; margin: 0; padding: 0; }
dialog { padding: 0; }
textarea { resize: vertical; }
input::placeholder, textarea::placeholder { opacity: 1; color: #9ca3af; }
button, [role="button"] { cursor: pointer; }
:disabled { cursor: default; }
img, svg, video, canvas, audio, iframe, embed, object { display: block; vertical-align: middle; }
img, video { max-width: 100%; height: auto; }
[hidden]:where(:not([hidden="until-found"])) { display: none; }

/* CSS Variables */
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.141 0.005 285.823);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.141 0.005 285.823);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.141 0.005 285.823);
  --primary: oklch(0.488 0.243 264.376);
  --primary-foreground: oklch(0.97 0.014 254.604);
  --secondary: oklch(0.967 0.001 286.375);
  --secondary-foreground: oklch(0.21 0.006 285.885);
  --muted: oklch(0.967 0.001 286.375);
  --muted-foreground: oklch(0.552 0.016 285.938);
  --accent: oklch(0.967 0.001 286.375);
  --accent-foreground: oklch(0.21 0.006 285.885);
  --destructive: oklch(0.577 0.245 27.325);
  --border: oklch(0.92 0.004 286.32);
  --input: oklch(0.92 0.004 286.32);
  --ring: oklch(0.705 0.015 286.067);
  --radius: 0.45rem;
  --font-sans: 'Figtree Variable', system-ui, sans-serif;
}

.dark {
  --background: oklch(0.141 0.005 285.823);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.21 0.006 285.885);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.21 0.006 285.885);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.42 0.18 266);
  --primary-foreground: oklch(0.97 0.014 254.604);
  --secondary: oklch(0.274 0.006 286.033);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.274 0.006 286.033);
  --muted-foreground: oklch(0.705 0.015 286.067);
  --accent: oklch(0.274 0.006 286.033);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.704 0.191 22.216);
  --border: oklch(1 0 0 / 10%);
  --input: oklch(1 0 0 / 15%);
  --ring: oklch(0.552 0.016 285.938);
}

/* Utility Classes */
.container { width: 100%; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem; }
@media (min-width: 640px) { .container { max-width: 640px; } }
@media (min-width: 768px) { .container { max-width: 768px; } }
@media (min-width: 1024px) { .container { max-width: 1024px; } }
@media (min-width: 1280px) { .container { max-width: 1280px; } }
@media (min-width: 1536px) { .container { max-width: 1536px; } }

.mx-auto { margin-left: auto; margin-right: auto; }
.mb-4 { margin-bottom: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.mb-8 { margin-bottom: 2rem; }
.mb-16 { margin-bottom: 4rem; }

.p-6 { padding: 1.5rem; }
.pt-0 { padding-top: 0; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.px-8 { padding-left: 2rem; padding-right: 2rem; }
.py-24 { padding-top: 6rem; padding-bottom: 6rem; }

.max-w-3xl { max-width: 48rem; }
.min-h-screen { min-height: 100vh; }

.text-center { text-align: center; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-xl { font-size: 1.25rem; line-height: 1.75rem; }
.text-5xl { font-size: 3rem; line-height: 1; font-weight: 700; letter-spacing: -0.025em; }

.font-semibold { font-weight: 600; }
.font-bold { font-weight: 700; }
.leading-none { line-height: 1; }

.text-primary { color: var(--primary); }
.text-muted-foreground { color: var(--muted-foreground); }
.text-card-foreground { color: var(--card-foreground); }
.text-primary-foreground { color: var(--primary-foreground); }
.text-secondary-foreground { color: var(--secondary-foreground); }

.bg-background { background-color: var(--background); }
.bg-card { background-color: var(--card); }
.bg-primary { background-color: var(--primary); }
.bg-secondary { background-color: var(--secondary); }

.border { border-width: 1px; border-color: var(--border); }
.border-transparent { border-color: transparent; }
.border-input { border-color: var(--input); }

.rounded-md { border-radius: 0.375rem; }
.rounded-xl { border-radius: 0.75rem; }
.rounded-full { border-radius: 9999px; }

.shadow { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); }

.flex { display: flex; }
.inline-flex { display: inline-flex; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.gap-2 { gap: 0.5rem; }
.gap-4 { gap: 1rem; }
.gap-6 { gap: 1.5rem; }

.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
@media (min-width: 768px) { .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); } }

.whitespace-nowrap { white-space: nowrap; }

/* Gradient */
.bg-gradient-to-b { background-image: linear-gradient(to bottom, var(--background), var(--muted)); }

/* Hover states */
.hover\\:bg-primary\\/90:hover { background-color: oklch(0.439 0.219 264.376); }
.hover\\:bg-accent:hover { background-color: var(--accent); }
.hover\\:text-accent-foreground:hover { color: var(--accent-foreground); }

/* Space utilities */
.space-y-1\\.5 > :not([hidden]) ~ :not([hidden]) { --tw-space-y-reverse: 0; margin-top: calc(0.375rem * calc(1 - var(--tw-space-y-reverse))); margin-bottom: calc(0.375rem * var(--tw-space-y-reverse)); }

/* Transition */
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }

/* Focus */
.focus\\:outline-none:focus { outline: 2px solid transparent; outline-offset: 2px; }
.focus\\:ring-2:focus { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }

/* Focus visible */
.focus-visible\\:outline-none:focus-visible { outline: 2px solid transparent; outline-offset: 2px; }
.focus-visible\\:ring-1:focus-visible { --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color); --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color); box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000); }

/* Disabled */
.disabled\\:pointer-events-none:disabled { pointer-events: none; }
.disabled\\:opacity-50:disabled { opacity: 0.5; }

/* Padding utilities */
.px-2\\.5 { padding-left: 0.625rem; padding-right: 0.625rem; }
.py-0\\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }

/* Height/Width */
.h-8 { height: 2rem; }
.w-8 { width: 2rem; }
.h-10 { height: 2.5rem; }

/* Tracking */
.tracking-tight { letter-spacing: -0.025em; }
`;

const app = new Hono<HonoEnv>();

// Cache resolved asset tags to avoid re-parsing on every request
let cachedAssetTags: { scripts: string; links: string } | null = null;

// Extract script and link tags from the built index.html via ASSETS binding.
// In dev (no ASSETS binding), falls back to Vite dev server path.
async function getAssetTags(env: HonoEnv["Bindings"]): Promise<{ scripts: string; links: string }> {
	if (cachedAssetTags) return cachedAssetTags;

	try {
		if (env.ASSETS) {
			const res = await env.ASSETS.fetch(new Request("http://fakehost/index.html"));
			if (res.ok) {
				const html = await res.text();
				const scripts = html.match(/<script[^>]*src="[^"]*"[^>]*><\/script>/g) || [];
				const links = (html.match(/<link[^>]*href="[^"]*"[^>]*>/g) || []).filter((l: string) =>
					l.includes("stylesheet")
				);
				if (scripts.length > 0 || links.length > 0) {
					cachedAssetTags = { scripts: scripts.join("\n\t"), links: links.join("\n\t") };
					return cachedAssetTags;
				}
			}
		}
	} catch {
		// ASSETS binding unavailable in dev
	}
	return {
		scripts: '<script type="module" src="/src/main.tsx"></script>',
		links: "",
	};
}

const JSON_LD = JSON.stringify(
	{
		"@context": "https://schema.org",
		"@type": "WebApplication",
		name: "Cloudflare App Template",
		description:
			"A production-ready full-stack template combining Cloudflare Workers, Hono, tRPC, React, TanStack Router, Better Auth, shadcn/ui, and D1 database.",
		applicationCategory: "DeveloperApplication",
		operatingSystem: "Any",
		offers: {
			"@type": "Offer",
			price: "0",
			priceCurrency: "USD",
		},
		author: {
			"@type": "Organization",
			name: "Coding Cowboys",
		},
		codeRepository: "https://github.com/thor-coding-cowboys/cloudflare-worker-app",
		programmingLanguage: ["TypeScript", "React"],
		featureList: [
			"Cloudflare Workers edge deployment",
			"Hono + tRPC type-safe APIs",
			"Better Auth authentication",
			"TanStack Router",
			"shadcn/ui components",
			"D1 database with Drizzle ORM",
		],
	},
	null,
	2
);

// SEO-optimized landing page rendered at the edge
app.get("/", async (c) => {
	const baseUrl = new URL(c.req.url).origin;
	const { scripts, links } = await getAssetTags(c.env);

	// Server-render the landing page component (using createElement instead of JSX for tsgo compatibility)
	const appHtml = renderToString(createElement(LandingPage, { baseUrl }));

	// Full HTML template with SEO meta tags
	const html = `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	
	<!-- Primary Meta Tags -->
	<title>Build Apps Faster With Modern Tools | Cloudflare App Template</title>
	<meta name="title" content="Build Apps Faster With Modern Tools | Cloudflare App Template" />
	<meta name="description" content="A production-ready full-stack template combining Cloudflare Workers, Hono, tRPC, React, TanStack Router, Better Auth, shadcn/ui, and D1 database. Build and deploy faster." />
	<meta name="keywords" content="cloudflare workers, hono, trpc, react, typescript, full-stack template, tanstack router, better auth, shadcn/ui, drizzle orm" />
	<meta name="author" content="Coding Cowboys" />
	<meta name="robots" content="index, follow" />
	<link rel="canonical" href="${baseUrl}/" />
	
	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="${baseUrl}/" />
	<meta property="og:title" content="Build Apps Faster With Modern Tools" />
	<meta property="og:description" content="A production-ready full-stack template combining the best tools for modern web development. Get started in minutes with type-safe APIs and beautiful UI components." />
	<meta property="og:image" content="${baseUrl}/og-image.png" />
	<meta property="og:site_name" content="Cloudflare App Template" />
	
	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="${baseUrl}/" />
	<meta property="twitter:title" content="Build Apps Faster With Modern Tools" />
	<meta property="twitter:description" content="A production-ready full-stack template combining the best tools for modern web development. Get started in minutes with type-safe APIs and beautiful UI components." />
	<meta property="twitter:image" content="${baseUrl}/og-image.png" />
	
	<!-- Structured Data (JSON-LD) -->
	<script type="application/ld+json">
${JSON_LD}
	</script>
	
	<!-- Fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	
	<!-- Built CSS from Vite -->
	${links}
	
	<!-- Tailwind CSS (Inlined for SSR - immediate styling before built CSS loads) -->
	<style>
${INLINE_CSS}
	</style>
	<!-- Dark mode detection - prevents flash of wrong theme -->
	<script>
		(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})();
	</script>
</head>
<body>
	<div id="app">${appHtml}</div>
	${scripts}
</body>
</html>`;

	return c.html(html);
});

export default app;
