import { FastifyRequest } from "fastify";
import type { MessageProvider } from "../types.ts";

export class WhatsAppProvider implements MessageProvider {
	async validateWebHook(req: FastifyRequest): Promise<boolean> {
		const signature = req.headers["x-hub-signature-256"];

		if (!signature) {
			return false;
		}

		return true;
	}

	parseIncomingMessage(req: FastifyRequest): {
		userIdentifier: string;
		text: string;
	} {
		const body = req.body as any;

		const message = body.entry[0].change[0].value.messages[0];

		return {
			userIdentifier: message.from,
			text: message.text.body,
		};
	}

	async sendMessage(input: {
		tenantId: string;
		userIdentifier: string;
		text: string;
	}): Promise<void> {
		console.log(input);
		throw new Error("Method not implemented.");
	}
}
