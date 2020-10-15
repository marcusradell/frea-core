import { createCache } from "./cache";
import { createEventStore } from "./event";
import { getEnv } from "../../get_env";
import Pgp from "pg-promise";
import { createOutgoing } from "./outgoing";
export * from "./types";
export * from "./event/types";

let db: Pgp.IDatabase<unknown>;

export const createStore = async <TEvent>({ module }: { module: string }) => {
  const dbUri = getEnv("DATABASE_URL");

  if (db === undefined) {
    db = Pgp()({
      connectionString: dbUri,
    });

    // Ensure DB connection.
    await db.query("select 1");

    console.log(`Event store DB connection is OK.`);
  }

  await db.none(/*sql*/ `CREATE SCHEMA IF NOT EXISTS $<module:name>`, {
    module,
  });

  const event = await createEventStore<TEvent>({ module, db });
  const cache = await createCache({ module, db });
  const outgoing = await createOutgoing({ module, db });

  return { event, cache, outgoing, db };
};
