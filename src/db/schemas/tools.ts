import {
	pgTable,
	uuid,
	text,
	timestamp,
	jsonb,
	pgEnum,
} from "drizzle-orm/pg-core";
import { tenants } from "./tenant.ts";

export const handlerTypeEnum = pgEnum("handler_type", ["internal", "http"]);

type JSONSchema = {
	type: "object";
	properties: Record<
		string,
		{
			type: "string" | "number" | "boolean";
		}
	>;
	required?: string[];
};

export const tools = pgTable("tools", {
	id: uuid("id").defaultRandom().primaryKey(),
	tenantId: uuid("tenant_id")
		.references(() => tenants.id)
		.notNull(),
	name: text("name").unique().notNull(),
	description: text("description").notNull(),
	schema: jsonb("schema").$type<JSONSchema>().notNull(),
	handlerType: handlerTypeEnum("handler_type").notNull(),
	config: jsonb("config"),
	createdAt: timestamp("created_at").defaultNow(),
	updatedAt: timestamp("updated_at").$onUpdateFn(() => new Date()),
});
