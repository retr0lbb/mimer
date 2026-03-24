import type { FastifyInstance, FastifyRequest } from "fastify";
import { ConversationService } from "../conversation/conversation.service.ts";
import { AIService } from "../ia/ai.service.ts";
import { AIOrchestrator } from "../ia/ai.orchestrator.ts";
import { ProviderFactory } from "../ia/providers/ai.provider.factory.ts";
import { ToolExecutor } from "../tools/tool.executor.ts";
import { ToolRegistry } from "../tools/tool.registry.ts";
import { ToolRepository } from "../tools/tool.repository.ts";
import { logToFile } from "../../utils/logger.ts";

const WA_HA_TENANT_ID = "eec6479f-b008-461c-9d6c-22699972aa17"; // CHANGE THIS LATER
const WA_HA_SESSION = "default";

export interface WahaWebhookPayload {
	id: string;
	timestamp: number;
	event: string;
	session: string;
	me?: {
		id: string;
		pushName: string;
	};
	payload: {
		id: string;
		from: string;
		body: string;
		hasMedia?: boolean;
		fromMe?: boolean;
	};
	engine?: string;
	environment?: {
		version: string;
		tier: string;
	};
}

interface SendTextResponse {
	id: string;
	timestamp: number;
	from: string;
	to: string;
	body: string;
}

async function sendTextToWaha(
	chatId: string,
	text: string,
): Promise<SendTextResponse> {
	const wahaUrl = process.env.WAHA_URL || "http://localhost:3000";
	const apiKey = process.env.WAHA_API_KEY;

	const response = await fetch(`${wahaUrl}/api/sendText`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...(apiKey && { "X-Api-Key": apiKey }),
		},
		body: JSON.stringify({
			session: WA_HA_SESSION,
			chatId,
			text,
		}),
	});

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(`WAHA API error: ${response.status} - ${errorText}`);
	}

	return response.json() as Promise<SendTextResponse>;
}

export async function wahaWebhookRoutes(app: FastifyInstance) {
	const providerFactory = new ProviderFactory();
	const toolRepository = new ToolRepository();
	const toolRegistry = new ToolRegistry(toolRepository);
	const toolExecutor = new ToolExecutor(toolRegistry);
	const iaOrchestrator = new AIOrchestrator(
		providerFactory,
		toolExecutor,
		toolRegistry,
	);
	const iaService = new AIService(iaOrchestrator);
	const conversationService = new ConversationService(iaService);

	app.post<{ Body: WahaWebhookPayload }>(
		"/webhooks/wa-ha",
		async (req: FastifyRequest<{ Body: WahaWebhookPayload }>, reply) => {
			const payload = req.body;

			logToFile("WAHA webhook received", { payload });

			if (!payload || payload.event !== "message") {
				return reply.status(200).send({ status: "ignored" });
			}

			const { payload: messagePayload } = payload;

			if (messagePayload.fromMe) {
				logToFile("Ignoring message from self", {
					messageId: messagePayload.id,
				});
				return reply.status(200).send({ status: "ignored" });
			}

			try {
				logToFile("Processing incoming WAHA message", {
					from: messagePayload.from,
					body: messagePayload.body,
				});

				const aiResponse = await conversationService.handleMessageIncoming({
					text: messagePayload.body,
					tenantId: WA_HA_TENANT_ID,
					userIdentifier: messagePayload.from,
					channel: "whatsapp",
				});

				if (aiResponse.content) {
					logToFile("Sending response via WAHA", {
						to: messagePayload.from,
						textLength: aiResponse.content.length,
					});

					await sendTextToWaha(messagePayload.from, aiResponse.content);
				}

				return reply.status(200).send({ status: "ok" });
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : String(error);
				logToFile("Error processing WAHA webhook", {
					error: errorMessage,
					from: messagePayload.from,
					body: messagePayload.body,
				});

				return reply
					.status(500)
					.send({ status: "error", message: errorMessage });
			}
		},
	);
}
