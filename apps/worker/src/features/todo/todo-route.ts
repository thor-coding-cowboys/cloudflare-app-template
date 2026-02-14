import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { todo } from "./todo-schema";
import { eq, and } from "drizzle-orm";
import { EnforcedAuthHonoEnv } from "../context";

const createTodoSchema = z.object({
	title: z.string().min(1),
});

const updateTodoSchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1).optional(),
	completed: z.boolean().optional(),
});

export const todoRouter = new Hono<EnforcedAuthHonoEnv>()
	.get("/", async (c) => {
		const auth = c.get("authentication");
		const db = c.get("db");

		const todos = await db.select().from(todo).where(eq(todo.userId, auth.user.id));

		return c.json({ todos });
	})
	.post("/", zValidator("json", createTodoSchema), async (c) => {
		const auth = c.get("authentication");
		const db = c.get("db");
		const data = c.req.valid("json");

		const newTodo = await db
			.insert(todo)
			.values({
				id: crypto.randomUUID(),
				title: data.title,
				completed: false,
				userId: auth.user.id,
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.returning();

		return c.json({ todo: newTodo[0] }, 201);
	})
	.patch("/", zValidator("json", updateTodoSchema), async (c) => {
		const auth = c.get("authentication");
		const db = c.get("db");
		const data = c.req.valid("json");

		const updated = await db
			.update(todo)
			.set({
				...(data.title && { title: data.title }),
				...(data.completed !== undefined && { completed: data.completed }),
				updatedAt: new Date(),
			})
			.where(and(eq(todo.id, data.id), eq(todo.userId, auth.user.id)))
			.returning();

		if (updated.length === 0) {
			return c.json({ error: "Todo not found" }, 404);
		}

		return c.json({ todo: updated[0] });
	})
	.delete("/:id", async (c) => {
		const auth = c.get("authentication");
		const db = c.get("db");
		const { id } = c.req.param();

		await db.delete(todo).where(and(eq(todo.id, id), eq(todo.userId, auth.user.id)));

		return c.json({ success: true });
	});
