import { z } from "zod";

export const PostTodoRequest = z.object({
  title: z.string(),
  completed: z.boolean(),
});

export type PostTodoRequest = z.infer<typeof PostTodoRequest>;

export const Todo = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean(),
});

export type Todo = z.infer<typeof Todo>;

export const PostTodoResponse = z.object({
  todo: Todo,
});

export type PostTodoResponse = z.infer<typeof PostTodoResponse>;

export const GetTodosResponse = z.object({
  todos: z.array(Todo),
});

export type GetTodosResponse = z.infer<typeof GetTodosResponse>;
