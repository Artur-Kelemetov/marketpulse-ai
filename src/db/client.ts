import "server-only";

import { mkdirSync } from "node:fs";
import { dirname, isAbsolute } from "node:path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import * as schema from "./schema";

const defaultDatabaseUrl = "file:./data/marketpulse.db";
const databaseUrl = process.env.DATABASE_URL ?? defaultDatabaseUrl;
const sqlitePath = resolveSqlitePath(databaseUrl);

if (sqlitePath !== ":memory:") {
  mkdirSync(dirname(sqlitePath), { recursive: true });
}

export const sqlite = new Database(sqlitePath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

export const db = drizzle(sqlite, { schema });

export type DatabaseClient = typeof db;

function resolveSqlitePath(url: string) {
  if (!url.startsWith("file:")) {
    throw new Error("DATABASE_URL must use a file: SQLite URL.");
  }

  const filePath = url.slice("file:".length);

  if (filePath === ":memory:") {
    return filePath;
  }

  return isAbsolute(filePath) ? filePath : filePath;
}

