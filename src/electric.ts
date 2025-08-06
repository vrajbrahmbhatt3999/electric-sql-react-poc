import { PGlite } from "@electric-sql/pglite";

export async function initDb() {
  const db = await PGlite.create({
    dataDir: "idb://my-db"
    // Remove extensions if not needed
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      name TEXT,
      completed BOOLEAN
    );
  `);

  return db;
}