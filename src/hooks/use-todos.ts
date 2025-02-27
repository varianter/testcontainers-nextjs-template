import { useCallback, useEffect, useState } from "react";
import { Todo } from "@prisma/client";
import { GetTodosResponse } from "@/app/api/todos/types";

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const loadTodos = useCallback(() => {
    getTodos().then(setTodos);
  }, [setTodos]);

  const addTodo = useCallback(
    (title: string) => {
      postTodo(title).then(loadTodos);
    },
    [loadTodos]
  );

  const completeTodo = useCallback(
    (id: string) => {
      postCompleteTodo(id).then(loadTodos);
    },
    [loadTodos]
  );

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  return { todos, addTodo, completeTodo };
}

async function getTodos(): Promise<Todo[]> {
  const response = await fetch(`/api/todos/`);

  const { todos }: GetTodosResponse = await response.json();

  return todos;
}

async function postTodo(title: string): Promise<void> {
  await fetch(`/api/todos/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title, completed: false }),
  });
}

async function postCompleteTodo(id: string): Promise<void> {
  await fetch(`/api/todos/${id}/complete`, {
    method: "POST",
  });
}
