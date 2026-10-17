import { createTodoSchema, deleteTodoSchema, renameTodoSchema, toggleTodoSchema } from "@schema";
import { defineHandler, defineHead, type InferProps } from "void";
import { getUser, requireAuth } from "void/auth";
import { createTodo, deleteTodo, listTodos, updateTodo } from "../../src/lib/todos";

export const loader = defineHandler(async (c) => {
	const user = getUser();
	if (!user) return c.redirect("/sign-in");
	return { todos: await listTodos(user.id) };
});

export type Props = InferProps<typeof loader>;

export const head = defineHead<Props>(() => ({ title: "Todos" }));

export const actions = {
	create: defineHandler.withValidator({ body: createTodoSchema })(async (c, { body }) => {
		const user = requireAuth(c);
		await createTodo(user.id, body.title);
	}),

	toggle: defineHandler.withValidator({ body: toggleTodoSchema })(async (c, { body }) => {
		const user = requireAuth(c);
		await updateTodo(user.id, body.id, { completed: body.completed });
	}),

	rename: defineHandler.withValidator({ body: renameTodoSchema })(async (c, { body }) => {
		const user = requireAuth(c);
		await updateTodo(user.id, body.id, { title: body.title });
	}),

	delete: defineHandler.withValidator({ body: deleteTodoSchema })(async (c, { body }) => {
		const user = requireAuth(c);
		await deleteTodo(user.id, body.id);
	}),
};
