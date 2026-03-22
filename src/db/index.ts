import { env } from "../config/env.ts"
import { drizzle } from "drizzle-orm/node-postgres"

import { conversations } from "./schemas/conversation.ts";
import { messages } from "./schemas/message.ts";

export const db = drizzle(env.DATABASE_URL!, {
    schema: {
        conversations,
        messages,
    },
});