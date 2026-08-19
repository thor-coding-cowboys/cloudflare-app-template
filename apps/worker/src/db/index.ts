import { defineRelations } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

// better-auth's drizzle adapter uses relational queries (db.query) for joins
// (e.g. sign-in/email looks up the user together with its accounts). Drizzle
// v1 derives these from `defineRelations`, which auto-infers relations from
// foreign keys in the schema.
const relations = defineRelations(schema);

export function getDb(d1: D1Database) {
	return drizzle(d1, { relations });
}

export type DrizzleDB = ReturnType<typeof getDb>;
