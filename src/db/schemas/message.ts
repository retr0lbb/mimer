import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { conversations } from "./conversation.ts";

export const messages = pgTable("messages", {
	id: uuid("id").defaultRandom().primaryKey(),

	conversationId: uuid("conversation_id")
		.references(() => conversations.id)
		.notNull(),

	role: text("role").notNull(),
	content: text("content").notNull(),

	toolName: text("tool_name"),

	metadata: jsonb("metadata"),

	createdAt: timestamp("created_at").defaultNow().notNull(),
});
