import { FastifyReply, FastifyRequest } from "fastify";
import { AIOrchestrator } from "./ai.orchestrator.ts";


export class AIService{
    constructor (private aiOrchestrator: AIOrchestrator){ }

    async chat(request: FastifyRequest, message: string){
        const tenant = request.tenant

        console.log(tenant)

        if(!tenant){
            throw new Error("Tenant not found")
        }

        const result = await this.aiOrchestrator.run({
            tenantId: tenant.id,
            providerName: "gemini",
            tools: [],
            messages: [
                {role: "user", content: message}
            ]
        })

        return result
    }

    async stream(request: FastifyRequest, message: string, reply: FastifyReply) {
        const tenant = request.tenant
        
        if(!tenant){
            throw new Error("Tenant not found")
        }

        reply.hijack()
        reply.raw.setHeader("Content-Type", "text/event-stream")
        reply.raw.setHeader("Cache-Control", "no-cache")
        reply.raw.setHeader("Connection", "keep-alive")

        reply.raw.write("event: start\ndata: streaming\n\n")

        try {
            await this.aiOrchestrator.runStream({
                tenantId: tenant.id,
                providerName: "gemini",
                messages: [
                    {role: "user", content: message}
                ],
                onChunk: (chunk) => {
                    reply.raw.write(`data: ${chunk}\n\n`)
                }
            })

            reply.raw.write("event: end\ndata: done\n\n")
            reply.raw.end()
        } catch (err) {
            console.error(err)
            reply.raw.end()
        }
    }
}