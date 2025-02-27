import { defineConfig, devices } from "@playwright/test";
import dotenvx from "@dotenvx/dotenvx";
import path from "path";
import getDevConfig from "./config";

dotenvx.config({
  path: path.resolve(__dirname, ".env.e2e"),
});

const config = getDevConfig();

const baseURL = `http://localhost:${config.port}`;

export default defineConfig({
  webServer: {
    command: "yarn dev-e2e",
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "html",
  use: {
    baseURL,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        ...config.PostgreSqlConfig,
      },
    },
  ],
});
