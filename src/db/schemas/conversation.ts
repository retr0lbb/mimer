import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { tenants } from "./tenant.ts";

export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),

  tenantId: uuid("tenant_id")
    .references(() => tenants.id)
    .notNull(),

  userIdentifier: text("user_identifier").notNull(),
  status: text("status").default("bot").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});