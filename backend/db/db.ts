import { drizzle, BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite'
import { Database } from 'bun:sqlite'
import path from 'path'

const dbPath = path.join(import.meta.dir, 'sqlite.db')
const sqlite = new Database(dbPath)
export const db: BunSQLiteDatabase = drizzle(sqlite)
