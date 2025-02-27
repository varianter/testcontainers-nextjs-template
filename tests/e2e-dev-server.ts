import { nextDev } from "next/dist/cli/next-dev";
import getDevConfig from "../config";

const config = getDevConfig();

async function startNextDev() {
  await nextDev(
    {
      port: config.port,
      hostname: "localhost",
      disableSourceMaps: false,
    },
    "env"
  );
}

startNextDev();
