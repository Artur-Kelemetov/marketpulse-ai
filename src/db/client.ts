import "server-only";

import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, join } from "node:path";

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

import * as schema from "./schema";

const defaultDatabaseUrl = process.env.VERCEL
  ? "file:/tmp/marketpulse.db"
  : "file:./data/marketpulse.db";
const databaseUrl = process.env.DATABASE_URL ?? defaultDatabaseUrl;
const sqlitePath = resolveSqlitePath(databaseUrl);

if (sqlitePath !== ":memory:") {
  mkdirSync(dirname(sqlitePath), { recursive: true });
}

export const sqlite = new Database(sqlitePath);
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("busy_timeout = 5000");
sqlite.pragma("foreign_keys = ON");
runAutoMigrationsIfNeeded(sqlite);

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

function runAutoMigrationsIfNeeded(database: Database.Database) {
  if (!shouldAutoMigrate()) {
    return;
  }

  database
    .prepare(
      "create table if not exists __marketpulse_migrations (name text primary key, applied_at integer not null)",
    )
    .run();

  const migrationsDir = join(process.cwd(), "drizzle");

  if (!existsSync(migrationsDir)) {
    return;
  }

  const migrationFiles = readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const file of migrationFiles) {
    const alreadyApplied = database
      .prepare("select name from __marketpulse_migrations where name = ?")
      .get(file);

    if (alreadyApplied) {
      continue;
    }

    const sql = readFileSync(join(migrationsDir, file), "utf8");

    database.transaction(() => {
      for (const statement of splitMigrationStatements(sql)) {
        database.exec(statement);
      }

      database
        .prepare(
          "insert into __marketpulse_migrations (name, applied_at) values (?, ?)",
        )
        .run(file, Date.now());
    })();
  }
}

function shouldAutoMigrate() {
  return process.env.VERCEL === "1" || process.env.MARKETPULSE_AUTO_MIGRATE === "true";
}

function splitMigrationStatements(sql: string) {
  return sql
    .split("--> statement-breakpoint")
    .map((statement) => statement.trim())
    .filter(Boolean);
}