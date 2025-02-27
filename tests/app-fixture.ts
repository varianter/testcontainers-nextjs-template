import { test as baseTest } from "@playwright/test";
import { StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import {
  migrateDb,
  startDb,
  takeDbSnapshot,
  resetDbToSnapshot,
  PostgreSqlTestcontainerConfig,
} from "../testcontainers/psql";

type DatabaseFixture = {
  databaseContainer: StartedPostgreSqlContainer;
  resetDatabase: () => Promise<void>;
};

const test = baseTest.extend<DatabaseFixture & PostgreSqlTestcontainerConfig>({
  dbContainerName: ["container-name", { option: true }],
  dbName: ["database", { option: true }],
  dbUserName: ["username", { option: true }],
  dbPassword: ["password", { option: true }],
  dbPort: [64301, { option: true }],

  databaseContainer: async (
    { dbPort, dbPassword, dbUserName, dbName, dbContainerName },
    use
  ) => {
    const container = await startDb({
      dbPort,
      dbPassword,
      dbUserName,
      dbName,
      dbContainerName,
    });

    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(container);
  },

  resetDatabase: async ({ databaseContainer }, use) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    await use(async () => {
      await resetDbToSnapshot(databaseContainer);
    });
  },
});

test.beforeAll(async ({ databaseContainer }) => {
  await migrateDb(databaseContainer);
  await takeDbSnapshot(databaseContainer);
});

test.afterAll(async ({ databaseContainer }) => {
  await databaseContainer.stop();
});

export { test };
