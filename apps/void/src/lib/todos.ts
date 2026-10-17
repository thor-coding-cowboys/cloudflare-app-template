import { and, db, desc, eq } from "void/db";
import { todo, type Todo } from "@schema";

export type { Todo };

export function listTodos(): Promise<Todo[]> {
	return db.select().from(todo).orderBy(desc(todo.createdAt), desc(todo.id));
}

export async function createTodo(userId: string, title: string): Promise<Todo> {
	const now = new Date().toISOString();
	const [created] = await db
		.insert(todo)
		.values({ id: crypto.randomUUID(), title, userId, createdAt: now, updatedAt: now })
		.returning();
	if (!created) throw new Error("Failed to create todo");
	return created;
}

export async function updateTodo(
	userId: string,
	id: string,
	changes: { title?: string; completed?: boolean }
): Promise<Todo | undefined> {
	const [updated] = await db
		.update(todo)
		.set({ ...changes, updatedAt: new Date().toISOString() })
		.where(and(eq(todo.id, id), eq(todo.userId, userId)))
		.returning();
	return updated;
}

export async function deleteTodo(userId: string, id: string): Promise<boolean> {
	const removed = await db
		.delete(todo)
		.where(and(eq(todo.id, id), eq(todo.userId, userId)))
		.returning({ id: todo.id });
	return removed.length > 0;
}
