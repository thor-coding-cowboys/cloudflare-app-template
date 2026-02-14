# Agent Instructions

## Package Manager

**bun** only. Never use npm/yarn/pnpm.

- Never run `bun test` always `bun run test`
- Never run `bun deploy` always `bun run deploy`

## Project Structure

**Frontend** (`apps/web`)

- Routes in `src/routes/`
- Components colocated with features using `-components` suffix (e.g., `routes/todo-components/`)
- Global shared components in `src/components/ui/`

**Backend** (`apps/worker`) - Package per feature:

```
src/features/
├── auth/           # Auth feature (schema, routes, types, better-auth config)
├── todo/           # Todo feature (schema, routes, trpc)
└── context/        # Shared context/middleware

src/db/schema.ts    # Re-exports all feature schemas
```

## Dependencies

Always use **catalog** for workspace dependencies. Define versions in root `package.json` catalog, reference with `"catalog:"` in workspace packages.

## tRPC Procedures

- `publicProcedure` - Public access
- `protectedProcedure` - Auth guaranteed (`ctx.authentication.user`)

**No redundant auth checks** - when using `protectedProcedure`, user is guaranteed. Access directly:

```typescript
const userId = ctx.authentication.user.id;
```

### Query Performance

**Never N+1 queries** - Cloudflare Workers have strict CPU limits. Querying inside loops causes `Worker exceeded CPU time limit` errors.

```typescript
// BAD - N queries
const items = await db.select().from(x).where(...);
await Promise.all(items.map(i => db.select().from(y).where(...)));

// GOOD - 1 query with join
const data = await db.select({...}).from(x).leftJoin(y, ...);
```

Always use joins/subqueries. Fetch related data in single round-trip.

## Hono Route Validation

Always validate headers, payload (body), and search params in Hono routes using **@hono/zod-validator**:

```typescript
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  age: z.number(),
});

app.post("/author", zValidator("json", schema), async (c) => {
  const data = c.req.valid("json"); // Type-safe validated data
  // ...
});
```

Validator targets: `"json"` (body), `"query"` (search params), `"header"`, `"param"` (route params).

## Database

Use Drizzle. Schema files live in feature folders (`src/features/*/`) and are re-exported from `src/db/schema.ts`.

Migration workflow:

1. `bun db:generate` - Create migration
2. `bun db:migrate` - Apply locally
3. Verify with `bun db:studio` or tests
4. `bun db:migrate:prod` - Production

Other: `bun db:studio` (inspect), `bun db:reset` (clean + reapply)

## Post-Change Commands

```bash
bun oxc
bun typecheck
```

Full verification: `bun check && bun test`

## Adding Features

### Add Schema

Create `apps/worker/src/features/myfeature/myfeature-schema.ts`, export from `apps/worker/src/db/schema.ts`:

```typescript
export * from "../features/myfeature/myfeature-schema";
```

### Add Hono Route

1. Create `apps/worker/src/features/myfeature/myfeature-route.ts`
2. Export from `apps/worker/src/features/myfeature/index.ts`
3. Import and add `.route("/api/myfeature", myfeatureRouter)` in `apps/worker/src/index.ts`

### Add tRPC Router

1. Create `apps/worker/src/features/myfeature/myfeature-trpc.ts`
2. Import and add to `appRouter` in `apps/worker/src/trpc-router.ts`

### Auth Middleware

Hono routes that need auth should use `EnforcedAuthHonoEnv` type from `features/context`:

```typescript
import type { EnforcedAuthHonoEnv } from "../features/context";

export const myRouter = new Hono<EnforcedAuthHonoEnv>();
```

Mount the route after `enforceAuthMiddleware` in `index.ts`:

```typescript
app.use("/api/myfeature/*", enforceAuthMiddleware);
```

## Authentication

Use **better-auth**. Reference: https://www.better-auth.com/llms.txt

### Better Auth Client

Always use the **better-auth client** when possible instead of building new Hono routes or tRPC procedures for authentication operations. The client provides type-safe methods for sign-in, sign-up, session management, password reset, and more.

```typescript
import { authClient } from "@/lib/auth-client";

// Use authClient instead of custom endpoints
const { data, error } = await authClient.signIn.email({
  email: "user@example.com",
  password: "password",
});
```

Only create custom auth routes when the built-in client methods don't cover your use case.

## Code Quality

- No redundant comments
- No `@ts-expect-error` or `@ts-ignore`
- Well-typed code throughout
- Oxc (oxlint + oxfmt) for lint/format

## Deployment

- Production: `bun run deploy`
- Monitor: `bunx wrangler tail`

Cloudflare D1 binding in `wrangler.jsonc`.

## Communication

Extreme concision. Sacrifice grammar for brevity.
