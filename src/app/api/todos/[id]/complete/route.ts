import db from "@/db";
import { PostCompleteTodoResponse } from "./types";

type Params = Promise<{ id: string }>;

export async function POST(_: Request, { params }: { params: Params }) {
  const id = (await params).id;
  const todo = await db.client.todo.update({
    where: { id },
    data: { completed: true },
  });

  const result = PostCompleteTodoResponse.safeParse({ todo });

  if (!result.success) {
    return Response.json({ errors: result.error.issues }, { status: 500 });
  }

  return Response.json(result.data);
}
