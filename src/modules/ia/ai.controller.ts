import type { FastifyReply, FastifyRequest } from "fastify";
import type { AIService } from "./ai.service.ts";
import { ChatRequestDTO } from "./ai.dto.ts";

export class AIController {
	constructor(private readonly aiService: AIService) {}

	chat = async (request: FastifyRequest, reply: FastifyReply) => {
		const { message } = ChatRequestDTO.parse(request.body);

		const result = await this.aiService.chat(request, message);

		return reply.send({ response: result });
	};

	stream = async (request: FastifyRequest, reply: FastifyReply) => {
		const { message } = ChatRequestDTO.parse(request.body);

		return this.aiService.stream(request, message, reply);
	};
}
