import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { conversations } from "../../db/schemas/conversation.ts";
import { messages } from "../../db/schemas/message.ts";
import type { AIService } from "../ia/ai.service.ts";
import type { AIMessage } from "../ia/ai.types.ts";

export class ConversationService {
	constructor(private readonly aiService: AIService) {}

	async handleMessageIncoming(message: {
		text: string;
		tenantId: string;
		userIdentifier: string;
		channel: string;
	}) {
		const foundConversation = await this.findConversation({
			tenantId: message.tenantId,
			userIdentifier: message.userIdentifier,
		});

		if (foundConversation === false) {
			const newConversation = await this.createConversation({
				channel: message.channel,
				tenantId: message.tenantId,
				userIdentifier: message.userIdentifier,
			});

			const [newMessage] = await db
				.insert(messages)
				.values({
					content: message.text,
					conversationId: newConversation.id,
					role: "user",
				})
				.returning();

			//TODO TYPE THIS SECTION CORRECTLY
			const aiMessage = await this.aiService.chat({
				history: [{ role: "user", content: newMessage.content } as AIMessage],
				tenantId: message.tenantId,
			});

			await db.insert(messages).values({
				content: aiMessage.content ?? "",
				conversationId: newConversation.id,
				role: "assistant",
			});

			return aiMessage;
		}

		let aiMessage: { content: string | undefined };
		await db.transaction(async (tx) => {
			tx.insert(messages).values({
				content: message.text,
				conversationId: foundConversation.id,
				role: "user",
			});

			const mappedMessages: AIMessage[] = foundConversation.messages.map(
				(m) => ({
					role: m.role as "user" | "assistant" | "system",
					content: m.content,
				}),
			) as AIMessage[];

			aiMessage = await this.aiService.chat({
				history: [
					...mappedMessages,
					{ role: "user", content: message.text } as AIMessage,
				],
				tenantId: message.tenantId,
			});

			tx.insert(messages).values({
				content: aiMessage.content ?? "",
				conversationId: foundConversation.id,
				role: "assistant",
			});
		});
		return aiMessage!;
	}

	async createConversation({
		channel,
		tenantId,
		userIdentifier,
	}: {
		channel: string;
		tenantId: string;
		userIdentifier: string;
	}) {
		const [conversation] = await db
			.insert(conversations)
			.values({
				channel,
				tenantId,
				userIdentifier,
			})
			.returning();

		return conversation;
	}

	async findConversation(input: { tenantId: string; userIdentifier: string }) {
		const [conversation] = await db
			.select()
			.from(conversations)
			.where(
				and(
					eq(conversations.tenantId, input.tenantId),
					eq(conversations.userIdentifier, input.userIdentifier),
				),
			);

		if (conversation) {
			const conversationMessages = await db
				.select()
				.from(messages)
				.where(eq(messages.conversationId, conversation.id))
				.orderBy(messages.createdAt);

			return {
				...conversation,
				messages: conversationMessages,
			};
		}

		return false;
	}
}
