import type { FastifyReply, FastifyRequest } from "fastify";
import type { AIService } from "./ai.service.ts";

export class AIController {
	constructor(private readonly aiService: AIService) {}

	chat = async (request: FastifyRequest, reply: FastifyReply) => {
		const { message } = request.body as { message: string };

		const result = await this.aiService.chat(request, message);

		return reply.send({ response: result });
	};

	stream = async (request: FastifyRequest, reply: FastifyReply) => {
		const { message } = request.body as { message: string };

		return this.aiService.stream(request, message, reply);
	};
}
