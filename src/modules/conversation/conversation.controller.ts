import z4 from "zod/v4";
import type { ConversationService } from "./conversation.service.ts";
import type { FastifyReply, FastifyRequest } from "fastify";

const messageSchema = z4.object({
	text: z4.string(),
	userIdentifier: z4.string(),
	channel: z4.string(),
});
export class ConversationController {
	constructor(private readonly conversationService: ConversationService) {}

	message = async (request: FastifyRequest, reply: FastifyReply) => {
		const { text, userIdentifier, channel } = messageSchema.parse(request.body);

		const tenant = request.tenant;
		const response = await this.conversationService.handleMessageIncoming({
			tenantId: tenant.id,
			text,
			channel,
			userIdentifier,
		});

		return reply.status(200).send(response);
	};
}
