import { FastifyInstance } from "fastify";
import { AIController } from "./ai.controller.ts";
import { AIService } from "./ai.service.ts";
import {findTenantPlugin} from "../../middlewears/find-tenant.ts"

export async function aiRoutes(app: FastifyInstance) {
    const service = new AIService()
    const controller = new AIController(service);

    app.post("/ai/chat", {preHandler: [findTenantPlugin]}, controller.chat )
    app.post("/ai/stream", {preHandler: [findTenantPlugin]}, controller.stream)
}