import { pgTable, uuid, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { tenants } from "./tenant.ts";

export const credentialsStatus = pgEnum("handler_type", ["active", "revoked"]);

export const credentials = pgTable("credentials", {
	id: uuid("id").defaultRandom().primaryKey(),
	tenantId: uuid("tenant_id")
		.references(() => tenants.id)
		.notNull(),
	creds: jsonb().notNull(),
	keys: jsonb().notNull(),
	status: credentialsStatus("credential_status").notNull().default("active"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
});
