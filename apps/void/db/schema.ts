import { createInsertSchema, createSelectSchema } from "void/drizzle-zod";
import { index, integer, sqliteTable, text } from "void/schema-d1";

/**
 * Application tables only. Void manages the Better Auth tables (user, session,
 * account, verification) and adds them to the same migrations automatically.
 */
export const todo = sqliteTable(
	"todo",
	{
		id: text("id").primaryKey(),
		title: text("title").notNull(),
		completed: integer("completed", { mode: "boolean" }).notNull().default(false),
		userId: text("user_id").notNull(),
		createdAt: text("created_at").notNull(),
		updatedAt: text("updated_at").notNull(),
	},
	(table) => [index("todo_user_id_idx").on(table.userId)]
);

export const createTodoSchema = createInsertSchema(todo, {
	title: (schema) => schema.trim().min(1).max(500),
}).pick({ title: true });

export const renameTodoSchema = createSelectSchema(todo, {
	title: (schema) => schema.trim().min(1).max(500),
}).pick({ id: true, title: true });

export const toggleTodoSchema = createSelectSchema(todo).pick({
	id: true,
	completed: true,
});

export const deleteTodoSchema = createSelectSchema(todo).pick({ id: true });

export type Todo = typeof todo.$inferSelect;
