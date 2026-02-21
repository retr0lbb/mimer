import {defineConfig} from "drizzle-kit"
import { env } from "./src/config/env.ts"

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/schemas/**.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: env.DATABASE_URL
    }
})