/**
 * Drizzle client for Baker's Perk.
 *
 * Uses the Neon pooled connection (PgBouncer transaction mode), so prepared
 * statements are disabled. Import { db } and the table helpers from "@/db".
 */
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Add it to your .env file.");
}

// Reuse the client across hot-reloads / serverless invocations in the same runtime.
const globalForDb = globalThis as unknown as { client?: ReturnType<typeof postgres> };

const client =
  globalForDb.client ??
  postgres(connectionString, {
    prepare: false, // required for Neon's pooled (transaction-mode) endpoint
    max: 1,
  });

if (process.env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });
export { schema };
export * from "./schema";
