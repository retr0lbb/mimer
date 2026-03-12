import { FastifyRequest } from "fastify";

export interface MessageProvider {
	validateWebHook(req: FastifyRequest): Promise<boolean>;

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
