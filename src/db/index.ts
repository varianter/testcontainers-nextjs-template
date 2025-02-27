import { PrismaClient } from "@prisma/client";

let client: PrismaClient;

const db = {
  get client(): PrismaClient {
    if (!client) {
      client = new PrismaClient();
    }
    return client;
  },
};

export default db;
