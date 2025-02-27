"use client";

import { useTodos } from "@/hooks/use-todos";
import { faker } from "@faker-js/faker";

export default function Todos() {
  const { todos, addTodo, completeTodo } = useTodos();

  return (
    <>
      <ol className="list-inside list-decimal text-sm text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="mb-2"
            onClick={() => completeTodo(todo.id)}
          >
            <span className="font-semibold">
              {todo.title} {todo.completed ? "✅" : "❌"}
            </span>
          </li>
        ))}
      </ol>
      <button
        className="px-2 text-white bg-blue-500 rounded-md"
        onClick={() => addTodo(faker.word.words(5))}
      >
        Add Todo
      </button>
    </>
  );
}
