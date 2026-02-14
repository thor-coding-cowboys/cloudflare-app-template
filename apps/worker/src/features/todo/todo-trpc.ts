import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { protectedProcedure, publicProcedure, createTRPCRouter } from "../../trpc";
import { todo } from "./todo-schema";

export const todoRouter = createTRPCRouter({
	list: publicProcedure.query(async ({ ctx }) => {
		return ctx.db.select().from(todo);
	}),

	create: protectedProcedure
		.input(z.object({ title: z.string().min(1) }))
		.mutation(async ({ ctx, input }) => {
			return ctx.db
				.insert(todo)
				.values({
					id: crypto.randomUUID(),
					title: input.title,
					completed: false,
					userId: ctx.authentication.user.id,
					createdAt: new Date(),
					updatedAt: new Date(),
				})
				.returning();
		}),

	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				title: z.string().min(1).optional(),
				completed: z.boolean().optional(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			return ctx.db
				.update(todo)
				.set({
					...(input.title && { title: input.title }),
					...(input.completed !== undefined && { completed: input.completed }),
					updatedAt: new Date(),
				})
				.where(and(eq(todo.id, input.id), eq(todo.userId, ctx.authentication.user.id)))
				.returning();
		}),

	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ ctx, input }) => {
			return ctx.db
				.delete(todo)
				.where(and(eq(todo.id, input.id), eq(todo.userId, ctx.authentication.user.id)));
		}),
});
