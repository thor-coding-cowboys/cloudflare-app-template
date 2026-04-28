import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "@/hooks/useSession";
import { useSignOut } from "@/hooks/useSignOut";
import { honoClient, parseResponse, DetailedError } from "@/lib/hono-client";
import {
	PlusIcon,
	TrashIcon,
	PencilSquareIcon,
	ArrowRightOnRectangleIcon,
	UserIcon,
} from "@heroicons/react/24/outline";

export const Route = createFileRoute("/todos-hono")({
	component: TodosHonoPage,
});

function TodosHonoPage() {
	const { data: session } = useSession();
	const signOut = useSignOut();
	const [todos, setTodos] = useState<
		Array<{
			id: string;
			title: string;
			completed: boolean;
			userId: string;
			createdAt: string;
			updatedAt: string;
		}>
	>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [newTodoTitle, setNewTodoTitle] = useState("");
	const [editingTodo, setEditingTodo] = useState<{ id: string; title: string } | null>(null);
	const [error, setError] = useState<string | null>(null);

	const isAuthenticated = !!session?.session;

	const fetchTodos = async () => {
		try {
			setIsLoading(true);
			setError(null);
			const result = await parseResponse(honoClient.api.todo.$get());
			setTodos(result.todos);
		} catch (e) {
			const err = e as DetailedError;
			setError(err.message || "Failed to load todos");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchTodos();
	}, []);

	const handleAddTodo = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newTodoTitle.trim()) return;
		try {
			setError(null);
			await parseResponse(
				honoClient.api.todo.$post({
					json: { title: newTodoTitle },
				})
			);
			setNewTodoTitle("");
			await fetchTodos();
		} catch (e) {
			const err = e as DetailedError;
			setError(err.message || "Failed to create todo");
		}
	};

	const handleToggleComplete = async (todo: { id: string; completed: boolean }) => {
		try {
			setError(null);
			await parseResponse(
				honoClient.api.todo.$patch({
					json: { id: todo.id, completed: !todo.completed },
				})
			);
			await fetchTodos();
		} catch (e) {
			const err = e as DetailedError;
			setError(err.message || "Failed to update todo");
		}
	};

	const handleDelete = async (id: string) => {
		try {
			setError(null);
			await parseResponse(honoClient.api.todo[":id"].$delete({ param: { id } }));
			await fetchTodos();
		} catch (e) {
			const err = e as DetailedError;
			setError(err.message || "Failed to delete todo");
		}
	};

	const handleStartEdit = (todo: { id: string; title: string }) => {
		setEditingTodo({ id: todo.id, title: todo.title });
	};

	const handleSaveEdit = async () => {
		if (!editingTodo || !editingTodo.title.trim()) return;
		try {
			setError(null);
			await parseResponse(
				honoClient.api.todo.$patch({
					json: { id: editingTodo.id, title: editingTodo.title },
				})
			);
			setEditingTodo(null);
			await fetchTodos();
		} catch (e) {
			const err = e as DetailedError;
			setError(err.message || "Failed to update todo");
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
			<div className="max-w-2xl mx-auto">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>Todo List (Hono RPC)</CardTitle>
						<div className="flex items-center gap-2">
							{isAuthenticated ? (
								<>
									<span className="text-sm text-muted-foreground flex items-center gap-1">
										<UserIcon className="h-4 w-4" />
										{session?.user?.email}
									</span>
									<Button variant="outline" size="sm" onClick={() => signOut()}>
										<ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
										Sign Out
									</Button>
								</>
							) : (
								<div className="flex gap-2">
									<Link to="/auth/sign-in">
										<Button variant="outline" size="sm">
											Sign In
										</Button>
									</Link>
									<Link to="/auth/sign-up">
										<Button size="sm">Sign Up</Button>
									</Link>
								</div>
							)}
						</div>
					</CardHeader>
					<CardContent>
						{error && (
							<div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
								{error}
							</div>
						)}
						{isAuthenticated && (
							<form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
								<Input
									placeholder="Add a new todo..."
									value={newTodoTitle}
									onChange={(e) => setNewTodoTitle(e.target.value)}
								/>
								<Button type="submit">
									<PlusIcon className="h-4 w-4 mr-1" />
									Add
								</Button>
							</form>
						)}

						{isLoading ? (
							<p className="text-center text-muted-foreground">Loading...</p>
						) : !todos?.length ? (
							<p className="text-center text-muted-foreground">No todos yet.</p>
						) : (
							<div className="space-y-2">
								{todos.map((todo) => (
									<div
										key={todo.id}
										className="flex items-center gap-3 p-3 border rounded-lg bg-card"
									>
										{isAuthenticated && (
											<Checkbox
												checked={todo.completed}
												onCheckedChange={() => handleToggleComplete(todo)}
											/>
										)}
										{editingTodo?.id === todo.id ? (
											<div className="flex-1 flex gap-2">
												<Input
													value={editingTodo.title}
													onChange={(e) =>
														setEditingTodo({ id: editingTodo.id, title: e.target.value })
													}
													autoFocus
												/>
												<Button size="sm" onClick={handleSaveEdit}>
													Save
												</Button>
											</div>
										) : (
											<>
												<span
													className={`flex-1 ${
														todo.completed ? "line-through text-muted-foreground" : ""
													}`}
												>
													{todo.title}
												</span>
												{isAuthenticated && (
													<div className="flex gap-1">
														<Button variant="ghost" size="sm" onClick={() => handleStartEdit(todo)}>
															<PencilSquareIcon className="h-4 w-4" />
														</Button>
														<Button variant="ghost" size="sm" onClick={() => handleDelete(todo.id)}>
															<TrashIcon className="h-4 w-4 text-destructive" />
														</Button>
													</div>
												)}
											</>
										)}
									</div>
								))}
							</div>
						)}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
