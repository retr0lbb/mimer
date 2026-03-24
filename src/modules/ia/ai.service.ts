import type { FastifyReply, FastifyRequest } from "fastify";
import type { AIOrchestrator } from "./ai.orchestrator.ts";
import { NotFoundError } from "../../_errors/errors.ts";
import type { AIMessage } from "./ai.types.ts";

interface AIServiceChat {
	tenantId: string;
	history: AIMessage[];
}

export class AIService {
	constructor(private aiOrchestrator: AIOrchestrator) {}

	async chat(input: AIServiceChat) {
		const result = await this.aiOrchestrator.run({
			tenantId: input.tenantId,
			providerName: "gemini",
			messages: input.history,
		});

		return result;
	}

	async stream(request: FastifyRequest, message: string, reply: FastifyReply) {
		const tenant = request.tenant;

		if (!tenant) {
			throw new NotFoundError("Tenant not found");
		}

		reply.hijack();
		reply.raw.setHeader("Content-Type", "text/event-stream");
		reply.raw.setHeader("Cache-Control", "no-cache");
		reply.raw.setHeader("Connection", "keep-alive");

		reply.raw.write("event: start\ndata: streaming\n\n");

		try {
			await this.aiOrchestrator.runStream({
				tenantId: tenant.id,
				providerName: "gemini",
				messages: [{ role: "user", content: message }],
				onChunk: (chunk) => {
					reply.raw.write(`data: ${chunk}\n\n`);
				},
			});

			reply.raw.write("event: end\ndata: done\n\n");
			reply.raw.end();
		} catch (err) {
			console.log(err);
			reply.raw.end();
		}
	}
}
