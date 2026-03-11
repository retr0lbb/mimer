import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { tenants } from "./tenant.ts";

export const conversations = pgTable("conversations", {
	id: uuid("id").defaultRandom().primaryKey(),
	tenantId: uuid("tenant_id")
		.references(() => tenants.id)
		.notNull(),

	channel: text("channel").notNull(),
	userIdentifier: text("user_identifier").notNull(),
	status: text("status").default("bot").notNull(),
	metadata: jsonb("metadata"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
