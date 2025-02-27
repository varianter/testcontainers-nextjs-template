import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { exec } from "child_process";

export type PostgreSqlTestcontainerConfig = {
  dbContainerName: string;
  dbName: string;
  dbUserName: string;
  dbPassword: string;
  dbPort: number;
};

export async function startDb(
  config: PostgreSqlTestcontainerConfig
): Promise<StartedPostgreSqlContainer> {
  const container = await new PostgreSqlContainer()
    .withName(config.dbContainerName)
    .withDatabase(config.dbName)
    .withUsername(config.dbUserName)
    .withPassword(config.dbPassword)
    .withExposedPorts({
      host: config.dbPort,
      container: 5432,
    })
    .withReuse()
    .start();

  const connectionString = container.getConnectionUri();
  console.log("Postgres started with connection string", connectionString);

  return container;
}

export async function migrateDb(container: StartedPostgreSqlContainer) {
  const connectionString = container.getConnectionUri();

  // Migrating the database to the latest schema
  const result = await execAsync(
    `export DATABASE_URL=${connectionString} && npx prisma migrate deploy --schema prisma/schema.prisma`
  );

  console.log("Migration result", result);
}

export async function takeDbSnapshot(container: StartedPostgreSqlContainer) {
  // Saving a snapshot of the database
  const snapshotResult = await container.exec(
    [
      "sh",
      "-c",
      `pg_dump -d ${getInternalConnectionString(
        container
      )} -Fc -f /tmp/snapshot.dump`,
    ],
    { user: "root" }
  );

  if (snapshotResult.exitCode !== 0) {
    console.error(
      "Failed when trying to take a snapshot of the db",
      snapshotResult
    );
  } else {
    console.log("Database snapshot taken");
  }
}

export async function resetDbToSnapshot(container: StartedPostgreSqlContainer) {
  const resetResult = await container.exec([
    "sh",
    "-c",
    `pg_restore --clean --if-exists -d ${getInternalConnectionString(
      container
    )} /tmp/snapshot.dump`,
  ]);

  if (resetResult.exitCode !== 0) {
    console.error("Failed when trying to take a reset the db", resetResult);
  } else {
    console.log("Database reset to snapshot");
  }
}

function getInternalConnectionString(container: StartedPostgreSqlContainer) {
  return container
    .getConnectionUri()
    .replace(container.getPort().toString(), "5432");
}

function execAsync(command: string) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}
