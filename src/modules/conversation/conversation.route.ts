import { FastifyInstance } from "fastify";
import { ConversationController } from "./conversation.controller.ts";
import { ConversationService } from "./conversation.service.ts";
import { AIService } from "../ia/ai.service.ts";
import { AIOrchestrator } from "../ia/ai.orchestrator.ts";
import { ProviderFactory } from "../ia/providers/ai.provider.factory.ts";
import { ToolExecutor } from "../tools/tool.executor.ts";
import { ToolRegistry } from "../tools/tool.registry.ts";
import { findTenantPlugin } from "../../middlewares/find-tenant.ts";

export async function conversationRoutes(app: FastifyInstance) {
	const providerFactory = new ProviderFactory();
	const toolRegistry = new ToolRegistry("not implemented");
	const toolExecutor = new ToolExecutor(toolRegistry);
	const iaOrchestrator = new AIOrchestrator(
		providerFactory,
		toolExecutor,
		toolRegistry,
	);
	const iaService = new AIService(iaOrchestrator);
	const conversationService = new ConversationService(iaService);
	const controller = new ConversationController(conversationService);

	app.post("/message", { preHandler: [findTenantPlugin] }, controller.message);
}
