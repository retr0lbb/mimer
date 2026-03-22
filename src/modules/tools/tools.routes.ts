import type { FastifyInstance } from "fastify";
import { ToolController } from "./tool.controller.ts";
import { ToolRepository } from "./tool.repository.ts";
import { ToolService } from "./tool.service.ts";
import { findTenantPlugin } from "../../middlewares/find-tenant.ts";

export async function toolRoutes(app: FastifyInstance) {
	const repository = new ToolRepository();
	const service = new ToolService(repository);
	const controller = new ToolController(service);

	app.post("/tool", { preHandler: [findTenantPlugin] }, controller.create);

	app.get("/tenants/:id/tools", controller.listByTenant);
}
