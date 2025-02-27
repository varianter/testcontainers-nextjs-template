import readline from "readline";
import { nextDev } from "next/dist/cli/next-dev";
import getDevConfig from "./config";
import {
  startDb,
  migrateDb,
  takeDbSnapshot,
  resetDbToSnapshot,
} from "./testcontainers/psql";
import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";

const config = getDevConfig();

async function startDev() {
  await Promise.all([startTestcontainers(), startNextDev()]);
}

let psqlContainer: StartedPostgreSqlContainer;

async function startTestcontainers() {
  psqlContainer = await startDb(config.PostgreSqlConfig);
  await migrateDb(psqlContainer);
}

async function startNextDev() {
  await nextDev(
    {
      port: config.port,
      hostname: "localhost",
      disableSourceMaps: false,
    },
    "cli"
  );
}

async function shutdown(remove: boolean = false) {
  if (psqlContainer) {
    await psqlContainer.stop({ remove });
  }
  process.exit();
}

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) process.stdin.setRawMode(true);
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

process.stdin.on("keypress", async (_, key) => {
  if (key && key.ctrl && key.name == "r") {
    await resetDbToSnapshot(psqlContainer);
  }
  if (key && key.ctrl && key.name == "s") {
    await takeDbSnapshot(psqlContainer);
  }
  if (key && key.ctrl && key.name === "c") {
    console.log("Shutting down");
    await shutdown();
  }
  if (key && key.ctrl && key.name === "d") {
    console.log("Shutting down and removing the container");
    await shutdown(true);
  }
});

startDev();
