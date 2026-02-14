# Cloudflare Worker App Template

A minimal full-stack TypeScript template for building apps on Cloudflare Workers with tRPC, Hono, Drizzle ORM, and better-auth.

## Features

- **Authentication**: Username/password with better-auth, organization support
- **API**: Both Hono REST endpoints and tRPC
- **Database**: Drizzle ORM with D1 (SQLite)
- **Type-safe**: End-to-end type safety from database to frontend

## Tech Stack

- **Runtime**: Bun
- **Backend**: Cloudflare Workers + Hono
- **API**: tRPC (at `/api/trpc/*`)
- **Database**: Cloudflare D1 with Drizzle ORM
- **Auth**: better-auth

## Prerequisites

1. **Cloudflare account** - Set up and authenticate with `bunx wrangler login`
2. **Create D1 database** - `bunx wrangler d1 create <your-app-name>`
3. **Set better-auth secret** - `bunx wrangler secret put BETTER_AUTH_SECRET`

## Template Setup

After creating your app from this template, you need to:

1. **Rename app references** - Replace `cloudflare-worker-app` with your app name everywhere:
   - `apps/worker/wrangler.jsonc` - `name` and `database_name`
   - `apps/worker/package.json` - npm scripts
   - `apps/worker/src/features/auth/better-auth.ts` - `modelName`

2. **Update package names** - Replace `@coding-cowboys/cloudflare-worker-app` with your org/name:
   - `package.json` - root name
   - `apps/worker/package.json` - worker name
   - `apps/web/package.json` - web name
   - `apps/web/vite.config.ts` - import alias
   - `apps/web/src/routes/__root.tsx` - tRPC import
   - `apps/web/src/lib/trpc.ts` - tRPC import
   - `packages/util/package.json` - util name
   - `bun.lock` - workspace references, auto updates with `bun install`

3. **Update preview scripts** - Replace `cloudflare-worker-app` with your app name:
   - `.github/scripts/preview/create-d1-db.ts` - `dbName` variable
   - `.github/scripts/preview/get-d1-db-id.ts` - `dbName` variable
   - `.github/scripts/preview/delete-d1-db.ts` - `dbName` variable
   - `.github/scripts/preview/prepare-wrangler-config.ts` - `workerName` variable
   - `.github/workflows/preview.yml` - worker delete command name

4. **Configure GitHub Actions for CI/CD** - Add the following secrets in your GitHub repository settings (Settings > Secrets and variables > Actions):
   - `CLOUDFLARE_API_TOKEN` - Create an API token at [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens) with "Edit Cloudflare Workers" permissions
   - `CLOUDFLARE_ACCOUNT_ID` - Found in Cloudflare Dashboard > Workers & Pages > Overview (right sidebar)
   - `CLOUDFLARE_WORKERS_SUBDOMAIN` - Your workers subdomain (e.g., `your-subdomain` from `your-subdomain.workers.dev`)

   These secrets are required for:
   - **CI workflow**: Auto-deploy to production on push to `main`
   - **Preview workflow**: Create isolated preview environments for each PR

## Getting Started

```bash
# Install dependencies
bun install

# Generate database migrations
bun db:generate

# Apply migrations locally
bun db:migrate

# Start development
bun run dev
```

## License

MIT
