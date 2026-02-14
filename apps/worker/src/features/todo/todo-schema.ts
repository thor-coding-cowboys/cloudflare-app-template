import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const todo = sqliteTable("todo", {
	id: text("id").primaryKey(),
	title: text("title").notNull(),
	completed: integer("completed", { mode: "boolean" }).default(false).notNull(),
	userId: text("user_id").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
