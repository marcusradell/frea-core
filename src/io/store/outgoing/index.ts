import { IDatabase } from "pg-promise";
import { createMod } from "./mod";
import { CacheStore } from "./types";

export * from "./types";

type Create = (args: {
  module: string;
  db: IDatabase<unknown>;
}) => Promise<CacheStore>;

export const createCache: Create = async ({ module, db }) => {
  await db.none(
    /*sql*/ `CREATE TABLE IF NOT EXISTS $<module:name>.outgoing(
        "id" serial PRIMARY KEY NOT NULL,
        "event" jsonb NOT NULL,
        "inserted_at" timestamp(6) NOT NULL DEFAULT statement_timestamp()
      )`,
    {
      module,
    }
  );

  console.log(`Ensured that ${module} outgoing store exists.`);

  return createMod();
};
