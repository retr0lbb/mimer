import { FastifyInstance } from "fastify";
import { AIController } from "./ai.controller.ts";
import { AIService } from "./ai.service.ts";

export async function aiRoutes(app: FastifyInstance) {
    const service = new AIService()
    const controller = new AIController(service);

    app.post("/ai/chat", controller.chat )
}