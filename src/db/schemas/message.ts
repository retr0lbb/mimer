import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { conversations } from "./conversation.js";

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),

  conversationId: uuid("conversation_id")
    .references(() => conversations.id)
    .notNull(),

  role: text("role").notNull(), // user | assistant | tool
  content: text("content").notNull(),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});