import { createTRPCRouter } from "./trpc/index";
import { todoRouter } from "./features/todo/todo-trpc";

export const router = createTRPCRouter({
	todo: todoRouter,
});

export type TRPCRouter = typeof router;
