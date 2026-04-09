import type { FastifyRequest } from "fastify";

export interface MessageProvider {
	parseIncomingMessage(req: FastifyRequest): {
		userIdentifier: string;
		text: string;
	};

	sendMessage(input: {
		tenantId: string;
		userIdentifier: string;
		text: string;
	}): Promise<void>;
}
