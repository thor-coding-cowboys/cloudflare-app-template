# `apps/void`

A [Void](https://void.cloud) app on Cloudflare Workers: server-rendered React pages,
D1 for storage, and Better Auth for email/password sessions. It mirrors what
`apps/worker` + `apps/web` do together, but as a single Void app with no tRPC.

## Features

- **Landing page** (`pages/index.tsx`) — simple hero, links into auth or the todo list.
- **Auth** (`pages/sign-in.tsx`, `pages/sign-up.tsx`) — Better Auth email + password,
  configured by Void (`void.config.ts` → `auth.providers`). Auth tables and the
  `/api/auth/*` routes are managed by Void; you do not write them.
- **Todos** (`pages/todos/`) — per-user CRUD via a page loader plus named page
  actions, using `Form`/`useForm` and `action()` from `@void/react`.
- **Shared auth for layouts** (`middleware/01.shared.ts`) — exposes the current user
  through `useShared()` and injects the pre-paint theme script.

## UI

Tailwind CSS v4 with the shadcn theme, matching `apps/web`:

- `src/styles.css` — Tailwind entry: `@import "tailwindcss"`, `tw-animate-css`,
  `shadcn/tailwind.css`, the Geist variable font, and the same `:root` / `.dark`
  design tokens (`oklch`, neutral base, `--radius: 0.625rem`). `@source` points at
  `pages/` and `src/`.
- `src/components/ui/*` — shadcn components copied verbatim from
  `apps/web/src/components/ui` (base-lyra style, Base UI primitives), so the two apps
  stay visually identical and stay swappable. Only the imports differ: `@/lib/utils`
  becomes a relative path, because Void owns the `paths` entry in the generated
  `.void/tsconfig.json` and a child `paths` would replace it.
- `src/components/theme-switcher.tsx` — light/dark/system cycle persisted under the
  `theme` localStorage key. `middleware/01.shared.ts` injects an inline script into
  `<head>` so the `.dark` class is set before first paint; the `dark` variant comes
  from shadcn's `@custom-variant dark (&:is(.dark *))`.

## Layout

```
db/schema.ts            Drizzle schema for app tables (auth tables are generated)
db/migrations/          Generated SQL migrations (committed)
middleware/             Global middleware (shared auth, theme script)
pages/                  File-based routes; each page may have a .server.ts companion
src/components/ui/      shadcn components (kept in sync with apps/web)
src/lib/                cn() helper, todo queries
src/styles.css          Tailwind v4 entry + shadcn theme tokens
scripts/                Tooling (see "drizzle-kit resolution" below)
void.config.ts          Void config: auth providers, Cloudflare settings, head defaults
vite.config.ts          voidPlugin + voidReact + @tailwindcss/vite
```

## Local development

```sh
bun install
bun --cwd apps/void db:migrate   # apply migrations to the local D1 database
bun --cwd apps/void dev          # http://localhost:5174
```

`void dev` runs a local D1 instance under `.void/` (gitignored) and creates the auth
tables automatically.

Other available scripts: `db:generate`, `db:push`, `db:seed`, `db:reset`, `db:status`,
`db:studio`, `build`, `typecheck`, `deploy`. Root aliases exist too:
`bun void:dev`, `bun void:build`, `bun void:db:generate`, `bun void:db:migrate`,
`bun void:deploy`.

## Database workflow

Schema changes start in `db/schema.ts`:

```sh
bun --cwd apps/void db:push      # prototype locally, no migration file
bun --cwd apps/void db:generate  # write db/migrations/<timestamp>_*.sql
bun --cwd apps/void db:migrate   # apply locally
```

Review and commit the generated SQL. `void deploy` applies pending migrations and
refuses to deploy if your schema has changes without a migration.

### drizzle-kit resolution

Void bundles drizzle-kit 0.31.x, which resolves `drizzle-orm` from bun's shared
isolated-install hoist directory. `apps/worker` pins drizzle-orm v1, which wins that
slot, so drizzle-kit would exit before running. `scripts/link-drizzle-orm.ts` links
the drizzle-orm copy that Void itself uses next to its drizzle-kit, making resolution
deterministic. It is idempotent and runs before every `db:*` and `deploy` script, plus
via the root `prepare` script after `bun install`.

## Deploy to Cloudflare

Void deploys the Worker, provisions D1, and applies migrations in one command. Prerequisites:

- A Cloudflare account (Workers Free is enough for this app).
- The Worker name in `void.config.ts` (`cloudflare.name`) is what gets created.

### First deploy

```sh
bun --cwd apps/void deploy
# or from the repo root:
bun void:deploy
```

That runs `void deploy --platform cloudflare`. Void opens your browser to sign in,
asks which account to use, provisions the D1 database, applies migrations, builds the
app, and prints the deployment URL. Commit `void.lock.json` afterwards — it records the
provisioned resource IDs, and other machines and CI need it.

`BETTER_AUTH_SECRET` is generated and stored for you on the first deploy, so there is
no secret to set up.

### Later deploys

```sh
bun --cwd apps/void deploy
```

The saved target in `.void/project.json` is reused.

### From CI (GitHub Actions)

```sh
bun install
bun --cwd apps/void deploy
```

with these environment variables:

| Variable                       | Why                                                                                |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`         | Required. Needs Workers Scripts: Edit plus read access to bound resources (D1).    |
| `CLOUDFLARE_ACCOUNT_ID`        | When the token can access more than one account.                                   |
| `CLOUDFLARE_WORKERS_SUBDOMAIN` | When the Worker has no version preview URL (Void uses it for the readiness check). |

`void init --github` generates a workflow for the saved target.

### Managing the deployment

```sh
bun --cwd apps/void project:status    # Worker versions and the active deployment
bun --cwd apps/void project:logs      # live tail of runtime logs
bun --cwd apps/void project:rollback  # pick a previous deployment to serve
```

### Custom domain

```sh
cd apps/void && bunx void domain add todos.example.com
```

## Environment variables

Declare keys in a root `env.ts` (see Void's env guide), put local values in `.env`
(gitignored, never deployed), and set production values with
`void secret put <NAME>`. Build-time client values use the `VITE_` prefix and come
from the build environment.

This app needs no environment variables out of the box. To add social login, set
`AUTH_<PROVIDER>_CLIENT_ID` / `AUTH_<PROVIDER>_CLIENT_SECRET` as secrets and add the
provider to `auth.providers` in `void.config.ts`.
