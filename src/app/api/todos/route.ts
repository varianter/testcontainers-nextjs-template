import db from "@/db";
import { GetTodosResponse, PostTodoRequest, PostTodoResponse } from "./types";

export async function POST(request: Request) {
  const body = await request.json();
  const reqResult = PostTodoRequest.safeParse(body);

  if (!reqResult.success) {
    return Response.json({ errors: reqResult.error.issues }, { status: 400 });
  }

  const todo = await db.client.todo.create({
    data: {
      title: reqResult.data.title,
      completed: reqResult.data.completed,
    },
  });

  const resResult = PostTodoResponse.safeParse({ todo });

  if (!resResult.success) {
    return Response.json({ errors: resResult.error.issues }, { status: 500 });
  }

  return Response.json(resResult.data, { status: 201 });
}

export async function GET() {
  const todos = await db.client.todo.findMany();

  const result = GetTodosResponse.safeParse({ todos });

  if (!result.success) {
    return Response.json({ errors: result.error.issues }, { status: 500 });
  }

  return Response.json(result.data);
}
