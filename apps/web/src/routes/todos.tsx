import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useSession } from "@/hooks/useSession";
import { useSignOut } from "@/hooks/useSignOut";
import { useTRPC } from "@/lib/trpc";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Edit2, LogOut, User } from "lucide-react";

export const Route = createFileRoute("/todos")({
	component: TodosPage,
});

function TodosPage() {
	const { data: session } = useSession();
	const signOut = useSignOut();
	const trpc = useTRPC();
	const queryClient = useQueryClient();

	const { data: todos, isLoading } = useQuery(trpc.todo.list.queryOptions());

	const createMutation = useMutation({
		...trpc.todo.create.mutationOptions(),
		onSuccess: () => queryClient.invalidateQueries(trpc.todo.list.queryFilter()),
	});

	const updateMutation = useMutation({
		...trpc.todo.update.mutationOptions(),
		onSuccess: () => queryClient.invalidateQueries(trpc.todo.list.queryFilter()),
	});

	const deleteMutation = useMutation({
		...trpc.todo.delete.mutationOptions(),
		onSuccess: () => queryClient.invalidateQueries(trpc.todo.list.queryFilter()),
	});

	const [newTodoTitle, setNewTodoTitle] = useState("");
	const [editingTodo, setEditingTodo] = useState<{ id: string; title: string } | null>(null);

	const isAuthenticated = !!session?.session;

	const handleAddTodo = (e: React.FormEvent) => {
		e.preventDefault();
		if (!newTodoTitle.trim()) return;
		createMutation.mutate({ title: newTodoTitle });
		setNewTodoTitle("");
	};

	const handleToggleComplete = (todo: { id: string; completed: boolean }) => {
		updateMutation.mutate({ id: todo.id, completed: !todo.completed });
	};

	const handleDelete = (id: string) => {
		deleteMutation.mutate({ id });
	};

	const handleStartEdit = (todo: { id: string; title: string }) => {
		setEditingTodo({ id: todo.id, title: todo.title });
	};

	const handleSaveEdit = () => {
		if (!editingTodo || !editingTodo.title.trim()) return;
		updateMutation.mutate({ id: editingTodo.id, title: editingTodo.title });
		setEditingTodo(null);
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-muted p-4">
			<div className="max-w-2xl mx-auto">
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle>Todo List</CardTitle>
						<div className="flex items-center gap-2">
							{isAuthenticated ? (
								<>
									<span className="text-sm text-muted-foreground flex items-center gap-1">
										<User className="h-4 w-4" />
										{session?.user?.email}
									</span>
									<Button variant="outline" size="sm" onClick={() => signOut()}>
										<LogOut className="h-4 w-4 mr-1" />
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
						{isAuthenticated && (
							<form onSubmit={handleAddTodo} className="flex gap-2 mb-6">
								<Input
									placeholder="Add a new todo..."
									value={newTodoTitle}
									onChange={(e) => setNewTodoTitle(e.target.value)}
								/>
								<Button type="submit" disabled={createMutation.isPending}>
									<Plus className="h-4 w-4 mr-1" />
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
															<Edit2 className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleDelete(todo.id)}
															disabled={deleteMutation.isPending}
														>
															<Trash2 className="h-4 w-4 text-destructive" />
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
