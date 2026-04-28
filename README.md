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

## Template Setup

After creating your app from this template:

```bash
# Install dependencies
bun install

# Run the interactive setup CLI
bun run setup
```

The setup script will prompt for:

| Prompt                       | Example         | What it replaces                                                        |
| ---------------------------- | --------------- | ----------------------------------------------------------------------- |
| Package scope prefix         | `my-org`        | `@coding-cowboys` in all `package.json` names (e.g. `@my-org/app-name`) |
| App name                     | `my-app`        | `app` in wrangler, scripts, DB names                                    |
| GitHub org or username       | `my-github-org` | `palmithor` in repo URLs (use your username if no org)                  |
| Display org name             | `My Org`        | `Pálmi Þór` in LICENSE, headers                                         |
| Display app name             | `My App`        | `Fjármál 1` in headers                                                  |
| Cloudflare workers subdomain | `my-subdomain`  | `coding-cowboys` in `*.workers.dev` URLs                                |

Press enter on any prompt to keep the template default.

### After Setup

1. **Authenticate with Cloudflare**

   ```bash
   bunx wrangler login
   ```

2. **Update the lockfile**

   ```bash
   bun install
   ```

3. **Create a D1 database**

   ```bash
   bunx wrangler d1 create <your-app-name>
   ```

4. **Update the `database_id`** in `apps/worker/wrangler.jsonc`

5. **Set the better-auth secret**
   ```bash
   bunx wrangler secret put BETTER_AUTH_SECRET
   ```

### Configure GitHub Actions

Add the following secrets in your GitHub repository settings (Settings > Secrets and variables > Actions):

- `CLOUDFLARE_API_TOKEN` - Create an API token at [Cloudflare Dashboard](https://dash.cloudflare.com/profile/api-tokens) with "Edit Cloudflare Workers" permissions
- `CLOUDFLARE_ACCOUNT_ID` - Found in Cloudflare Dashboard > Workers & Pages > Overview (right sidebar)
- `CLOUDFLARE_WORKERS_SUBDOMAIN` - Your workers subdomain (e.g., `your-subdomain` from `your-subdomain.workers.dev`)

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
