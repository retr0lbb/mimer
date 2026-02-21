import { env } from "../config/env.ts"
import { drizzle } from "drizzle-orm/node-postgres"

export const db = drizzle(env.DATABASE_URL!)