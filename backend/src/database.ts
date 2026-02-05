import { Database } from "./types.js"
import { Pool } from "pg"
import { Kysely, PostgresDialect } from 'kysely'
import "dotenv/config"

const dialect = new PostgresDialect({
  pool: new Pool({
    database: 'postgres',
    host: 'localhost',
    user: 'postgres',
    password: process.env.PG_PASSWORD,
    port: 5432,
    max: 10,
  })
})

export const db = new Kysely<Database>({
  dialect,
})