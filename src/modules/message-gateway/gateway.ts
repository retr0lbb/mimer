import type { FastifyRequest } from "fastify";
import type { MessageProviderFactory } from "./providers/providerFactory.ts";

export class MessageGateway {
	constructor(private readonly providerFactory: MessageProviderFactory) {}

	async sendMessage(input: {
		channel: string;
		tenantId: string;
		userIdentifier: string;
		text: string;
	}) {
		const provider = this.providerFactory.create(input.channel);

		await provider.sendMessage(input);
	}

	async handleWebHook(channel: string, req: FastifyRequest) {
		const provider = this.providerFactory.create(channel);

		const isValid = provider.validateWebHook(req);

		if (!isValid) {
			throw new Error("Invalid WebHook");
		}

		const message = provider.parseIncomingMessage(req);

		return message;
	}
}
