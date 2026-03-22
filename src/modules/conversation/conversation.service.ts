import { and, eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { conversations } from "../../db/schemas/conversation.ts";
import { messages } from "../../db/schemas/message.ts";
import type { AIService } from "../ia/ai.service.ts";
import type { AIMessage } from "../ia/ai.types.ts";

export class ConversationService {
	constructor(private readonly aiService: AIService) {}

	parseMessagesIntoAIMessage(
		messages: {
			id: string;
			createdAt: Date;
			metadata: unknown;
			conversationId: string;
			role: string;
			content: string;
			toolName: string | null;
		}[],
	): AIMessage[] {
		const mappedArr: AIMessage[] = messages.map((message) => ({
			content: message.content,
			name: message.toolName,
			role: message.role as any,
		}));

		return mappedArr;
	}

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
			console.log("NO CONVERSATION FOUND");
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

			console.log("SAVING MESSAGE ON A NEW CONVERSATION");

			await db.insert(messages).values({
				content: aiMessage.content ?? "",
				conversationId: newConversation.id,
				role: "assistant",
			});

			return aiMessage;
		}

		let aiMessage: { content: string | undefined };
		await db.transaction(async (tx) => {
			console.log("INIT OF TRANSACTION");
			await tx.insert(messages).values({
				content: message.text,
				conversationId: foundConversation.id,
				role: "user",
			});

			const messagesFromDb = await tx.query.messages.findMany({
				where: eq(messages.conversationId, foundConversation.id),
			});

			const mappedMessages = this.parseMessagesIntoAIMessage(messagesFromDb);

			aiMessage = await this.aiService.chat({
				history: [...mappedMessages],
				tenantId: message.tenantId,
			});

			console.log("SAVING MESSAGE ON EXISTING CONVERSATION");
			await tx.insert(messages).values({
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
