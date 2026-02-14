import { TRPCClientError } from "@trpc/client";
import { beforeEach, describe, expect, it } from "vitest";
import { createAuthContext } from "../../../test/auth-context-util";
import { createTRPCTestClient } from "../../../test/trpc-test-client";

describe("todo router", () => {
	let sessionToken: string;

	beforeEach(async () => {
		const ctx = await createAuthContext();
		sessionToken = ctx.sessionToken;
	});

	it("lists all todos", async () => {
		const client = createTRPCTestClient({ sessionToken });

		const result = await client.todo.list.query();

		expect(result).toBeInstanceOf(Array);
	});

	it("creates a todo", async () => {
		const ctx = await createAuthContext();
		const client = createTRPCTestClient({ sessionToken: ctx.sessionToken });

		const result = await client.todo.create.mutate({
			title: "Test Todo",
		});

		expect(result).toBeDefined();
		expect(result[0]).toBeDefined();
		expect(result[0].title).toBe("Test Todo");
		expect(result[0].completed).toBe(false);
		expect(result[0].userId).toBe(ctx.user.id);
	});

	it("updates a todo", async () => {
		const ctx = await createAuthContext();
		const client = createTRPCTestClient({ sessionToken: ctx.sessionToken });

		// Create a todo first
		const [created] = await client.todo.create.mutate({
			title: "Test Todo",
		});

		// Update the todo
		const result = await client.todo.update.mutate({
			id: created.id,
			title: "Updated Todo",
			completed: true,
		});

		expect(result).toBeDefined();
		expect(result[0]).toBeDefined();
		expect(result[0].title).toBe("Updated Todo");
		expect(result[0].completed).toBe(true);
	});

	it("deletes a todo", async () => {
		const ctx = await createAuthContext();
		const client = createTRPCTestClient({ sessionToken: ctx.sessionToken });

		// Create a todo first
		const [created] = await client.todo.create.mutate({
			title: "Test Todo",
		});

		// Delete the todo
		await client.todo.delete.mutate({ id: created.id });

		// Verify the todo is deleted by listing
		const todos = await client.todo.list.query();
		const deletedTodo = todos.find((t) => t.id === created.id);
		expect(deletedTodo).toBeUndefined();
	});

	it("only updates todos owned by the user", async () => {
		// Create two users
		const user1Ctx = await createAuthContext();
		const user2Ctx = await createAuthContext();

		const user1Client = createTRPCTestClient({ sessionToken: user1Ctx.sessionToken });
		const user2Client = createTRPCTestClient({ sessionToken: user2Ctx.sessionToken });

		// User 1 creates a todo
		const [user1Todo] = await user1Client.todo.create.mutate({
			title: "User 1 Todo",
		});

		// User 2 tries to update User 1's todo (should return empty array since no rows match)
		const result = await user2Client.todo.update.mutate({
			id: user1Todo.id,
			title: "Hacked Todo",
		});

		// No rows should be updated (empty array returned)
		expect(result).toEqual([]);
	});

	it("only deletes todos owned by the user", async () => {
		// Create two users
		const user1Ctx = await createAuthContext();
		const user2Ctx = await createAuthContext();

		const user1Client = createTRPCTestClient({ sessionToken: user1Ctx.sessionToken });
		const user2Client = createTRPCTestClient({ sessionToken: user2Ctx.sessionToken });

		// User 1 creates a todo
		const [user1Todo] = await user1Client.todo.create.mutate({
			title: "User 1 Todo",
		});

		// User 2 tries to delete User 1's todo (should not delete anything)
		await user2Client.todo.delete.mutate({ id: user1Todo.id });

		// Verify User 1's todo still exists
		const user1Todos = await user1Client.todo.list.query();
		const todoStillExists = user1Todos.find((t) => t.id === user1Todo.id);
		expect(todoStillExists).toBeDefined();
		expect(todoStillExists?.title).toBe("User 1 Todo");
	});

	it("returns unauthorized when creating todo without session", async () => {
		const client = createTRPCTestClient();

		await expect(client.todo.create.mutate({ title: "Test Todo" })).rejects.toThrow(
			TRPCClientError
		);
	});

	it("returns unauthorized when updating todo without session", async () => {
		const client = createTRPCTestClient();

		await expect(client.todo.update.mutate({ id: "some-id", title: "Test" })).rejects.toThrow(
			TRPCClientError
		);
	});

	it("returns unauthorized when deleting todo without session", async () => {
		const client = createTRPCTestClient();

		await expect(client.todo.delete.mutate({ id: "some-id" })).rejects.toThrow(TRPCClientError);
	});
});
