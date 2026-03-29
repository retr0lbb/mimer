import { FastifyRequest } from "fastify";
import type { MessageProvider } from "../../types.ts";
import createWASocket, { type proto } from "baileys";
import type { BaileysAuthStateManager } from "./utils/database-auth-adapter.ts";

interface BaileysWebhookBody {
	message: proto.IWebMessageInfo;
}

export class BaileysProvider implements MessageProvider {
	private socket: ReturnType<typeof createWASocket> | null = null;

	constructor(private readonly authStateManager: BaileysAuthStateManager) {}

	async initConnection(tenantId: string): Promise<void> {
		const { state, saveCreds } =
			await this.authStateManager.getState(tenantId);

		this.socket = createWASocket({
			auth: state,
		});

		this.socket.ev.on("creds.update", saveCreds);
	}

	validateWebHook(req: FastifyRequest): Promise<boolean> {
		throw new Error("Method not implemented.");
	}

	parseIncomingMessage(req: FastifyRequest): {
		userIdentifier: string;
		text: string;
	} {
		const body = req.body as BaileysWebhookBody;
		const waMessage = body.message;

		const userIdentifier = waMessage.key?.remoteJid;
		if (!userIdentifier) {
			throw new Error("Missing remoteJid in incoming Baileys message");
		}

		const text = this.extractTextFromMessage(waMessage.message);
		if (!text) {
			throw new Error("No text content found in incoming Baileys message");
		}

		return { userIdentifier, text };
	}

	sendMessage(input: {
		tenantId: string;
		userIdentifier: string;
		text: string;
	}): Promise<void> {
		throw new Error("Method not implemented.");
	}

	private extractTextFromMessage(
		message: proto.IMessage | null | undefined,
	): string | null {
		if (!message) {
			return null;
		}

		if (message.conversation) {
			return message.conversation;
		}

		if (message.extendedTextMessage?.text) {
			return message.extendedTextMessage.text;
		}

		return null;
	}
}
