import { ConversationService } from "./conversation.service.ts";
import { FastifyReply, FastifyRequest } from "fastify";

export class ConversationController {
	constructor(private readonly conversationService: ConversationService) {}

	message = async (request: FastifyRequest, reply: FastifyReply) => {};
}
