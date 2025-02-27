import { z } from "zod";
import { PostgreSqlTestcontainerConfig } from "./testcontainers/psql";

export type DevConfig = {
  isCI: boolean;
  port: number;
  PostgreSqlConfig: PostgreSqlTestcontainerConfig;
};

export default function getDevConfig(): DevConfig {
  const env = getEnv();
  return {
    isCI: env.CI,
    port: env.PORT,
    PostgreSqlConfig: {
      dbContainerName: env.PSQL_TESTCONTAINER_NAME,
      dbName: env.PSQL_DATABASE_NAME,
      dbUserName: env.PSQL_USER_NAME,
      dbPassword: env.PSQL_PASSWORD,
      dbPort: env.PSQL_PORT,
    },
  };
}

function getEnv(): z.infer<typeof DevEnv> {
  return DevEnv.parse(process.env);
}

const DevEnv = z.object({
  CI: z.coerce.boolean(),

  // App
  PORT: z.coerce.number().min(1),

  // Database
  PSQL_PORT: z.coerce.number().min(1),
  PSQL_TESTCONTAINER_NAME: z.string(),
  PSQL_DATABASE_NAME: z.string(),
  PSQL_USER_NAME: z.string(),
  PSQL_PASSWORD: z.string(),
});
