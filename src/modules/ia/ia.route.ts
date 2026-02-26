import type { FastifyInstance } from "fastify";
import { AIController } from "./ai.controller.ts";
import { AIService } from "./ai.service.ts";
import { findTenantPlugin } from "../../middlewears/find-tenant.ts";
import { AIOrchestrator } from "./ai.orchestrator.ts";
import { ProviderFactory } from "./providers/ai.provider.factory.ts";
import { ToolExecutor } from "../tools/tool.executor.ts";
import { ToolRegistry } from "../tools/tool.registry.ts";

export async function aiRoutes(app: FastifyInstance) {
	const aiProviderFactory = new ProviderFactory();
	const toolRegistry = new ToolRegistry("not implemented");
	const toolExecutor = new ToolExecutor(toolRegistry);
	const aiOrchestrator = new AIOrchestrator(aiProviderFactory, toolExecutor);
	const service = new AIService(aiOrchestrator);
	const controller = new AIController(service);

	app.post("/ai/chat", { preHandler: [findTenantPlugin] }, controller.chat);
	app.post("/ai/stream", { preHandler: [findTenantPlugin] }, controller.stream);
}
