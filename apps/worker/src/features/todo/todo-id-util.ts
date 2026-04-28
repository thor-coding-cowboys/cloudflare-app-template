import { ulid } from "ulid";

export function generateTodoId(): string {
	return `todo_${ulid()}`;
}
