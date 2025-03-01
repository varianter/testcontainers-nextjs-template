import { expect } from "@playwright/test";
import { test } from "./app-fixture";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

test("can add todo", async ({ page }) => {
  expect(await page.title()).toBe("Todos");

  await expect(page.locator("li")).toHaveCount(0);

  await page.getByRole("button", { name: "Add Todo" }).click();
  await page.waitForSelector("li");
  const todo = await page.$("li");
  expect(todo).toBeTruthy();
});

test("can complete todo", async ({ page }) => {
  expect(await page.title()).toBe("Todos");

  await expect(page.locator("li")).toHaveCount(0);

  await page.getByRole("button", { name: "Add Todo" }).click();
  await page.waitForSelector("li");
  const todo = await page.$("li");
  expect(todo).toBeTruthy();

  await expect(page.locator("li >> span")).toContainText("❌");

  await Promise.all([
    page.waitForResponse(
      (resp) => resp.url().includes("/api/todos/") && resp.status() === 200
    ),
    todo!.click(),
  ]);

  await expect(page.locator("li >> span")).toContainText("✅");
});
