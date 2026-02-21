import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";

export const tenants = pgTable("tenants", {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    apiKey: text("api_key").notNull().unique(),
    createdAt: timestamp("created_at").defaultNow().notNull()
})