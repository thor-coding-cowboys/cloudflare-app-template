import { Delete02Icon, PencilEdit02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { action, Form, useForm } from "@void/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../src/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../../src/components/ui/card";
import { Checkbox } from "../../src/components/ui/checkbox";
import { Input } from "../../src/components/ui/input";
import type { Props } from "./index.server";

type TodoItem = Props["todos"][number];

export default function TodosPage({ todos }: Props) {
	const form = useForm("/todos?create", { title: "" });
	const [error, setError] = useState<string | null>(null);
	const [editing, setEditing] = useState<{ id: string; title: string } | null>(null);
	const [busyId, setBusyId] = useState<string | null>(null);

	const { wasSuccessful, pending, setData } = form;
	// Void keeps the submitted values as the next defaults and never commits an
	// intermediate `wasSuccessful: false`, so watch the settled transition instead
	// of the flag itself, then clear the draft.
	const previous = useRef({ pending: false, successful: false });
	useEffect(() => {
		const settled = !pending && wasSuccessful;
		const settledBefore = !previous.current.pending && previous.current.successful;
		if (settled && !settledBefore) setData("title", "");
		previous.current = { pending, successful: wasSuccessful };
	}, [pending, wasSuccessful, setData]);

	async function toggle(todo: TodoItem) {
		setError(null);
		setBusyId(todo.id);
		const result = await action("/todos?toggle", {
			data: { id: todo.id, completed: !todo.completed },
		});
		setBusyId(null);
		if (!result.ok) setError(result.error.message);
	}

	async function remove(id: string) {
		setError(null);
		setBusyId(id);
		const result = await action("/todos?delete", { data: { id } });
		setBusyId(null);
		if (!result.ok) setError(result.error.message);
	}

	async function saveEdit() {
		if (!editing) return;
		const title = editing.title.trim();
		if (!title) return;
		setError(null);
		const result = await action("/todos?rename", { data: { id: editing.id, title } });
		if (result.ok) setEditing(null);
		else setError(result.error.message);
	}

	const open = todos.filter((todo) => !todo.completed).length;

	return (
		<Card className="mx-auto w-full max-w-xl">
			<CardHeader className="border-b">
				<CardTitle className="text-lg">Your todos</CardTitle>
				<CardDescription>
					{todos.length === 0
						? "Nothing here yet — add your first todo."
						: `${open} open of ${todos.length}`}
				</CardDescription>
			</CardHeader>
			<CardContent className="flex flex-col gap-4">
				{error && <p className="text-destructive text-xs">{error}</p>}

				<Form form={form} className="flex items-start gap-2">
					<Input
						name="title"
						placeholder="What needs doing?"
						aria-label="New todo"
						value={form.data.title}
						onChange={(event) => form.setData("title", event.target.value)}
						aria-invalid={form.errors.title ? true : undefined}
					/>
					<Button type="submit" disabled={form.pending}>
						<HugeiconsIcon icon={PlusSignIcon} />
						Add
					</Button>
				</Form>
				{form.errors.title && <p className="text-destructive text-xs">{form.errors.title}</p>}

				{todos.length === 0 ? (
					<p className="text-muted-foreground py-8 text-center">No todos yet.</p>
				) : (
					<ul className="flex flex-col gap-2">
						{todos.map((todo) => (
							<li key={todo.id} className="flex min-h-10 items-center gap-2 border px-2.5 py-1.5">
								<Checkbox
									checked={todo.completed}
									disabled={busyId === todo.id}
									aria-label={
										todo.completed ? `Mark "${todo.title}" as open` : `Complete "${todo.title}"`
									}
									onCheckedChange={() => toggle(todo)}
								/>

								{editing?.id === todo.id ? (
									<>
										<Input
											className="flex-1"
											autoFocus
											aria-label="Edit todo"
											value={editing.title}
											onChange={(event) => setEditing({ id: todo.id, title: event.target.value })}
											onKeyDown={(event) => {
												if (event.key === "Enter") saveEdit();
												if (event.key === "Escape") setEditing(null);
											}}
										/>
										<Button size="sm" onClick={saveEdit}>
											Save
										</Button>
										<Button size="sm" variant="ghost" onClick={() => setEditing(null)}>
											Cancel
										</Button>
									</>
								) : (
									<>
										<span
											className={
												todo.completed
													? "text-muted-foreground flex-1 text-xs line-through"
													: "flex-1 text-xs"
											}
										>
											{todo.title}
										</span>
										<Button
											size="icon-sm"
											variant="ghost"
											aria-label={`Edit "${todo.title}"`}
											onClick={() => setEditing({ id: todo.id, title: todo.title })}
										>
											<HugeiconsIcon icon={PencilEdit02Icon} />
										</Button>
										<Button
											size="icon-sm"
											variant="ghost"
											disabled={busyId === todo.id}
											aria-label={`Delete "${todo.title}"`}
											onClick={() => remove(todo.id)}
										>
											<HugeiconsIcon icon={Delete02Icon} />
										</Button>
									</>
								)}
							</li>
						))}
					</ul>
				)}
			</CardContent>
		</Card>
	);
}
