import { z } from "zod";
import { Todo } from "../../types";

export const PostCompleteTodoResponse = z.object({
  todo: Todo,
});

export type PostCompleteTodoResponse = z.infer<typeof PostCompleteTodoResponse>;
