import { FastifyReply, FastifyRequest } from "fastify";
import { aiProviderFactory } from "./ai.provider.factory.ts";


export class AIService{
    async chat(request: FastifyRequest, message: string){
        const tenant = request.tenant

        if(!tenant){
            throw new Error("Tenant not found")
        }

        const provider = aiProviderFactory()

        const response = await provider.chat({
            message,
            tenantId: tenant.name ?? "GIBRALTAR"
        })

        return response
    }

    async stream(request: FastifyRequest, message: string, reply: FastifyReply) {
        if(!request.tenant){
            throw new Error("Tenant not found")

        }
        const provider = aiProviderFactory()

        if (!provider.stream) {
            throw new Error("Stream not implemented for this provider")
        }

        reply.hijack()

        reply.raw.setHeader("Content-Type", "text/event-stream")
        reply.raw.setHeader("Cache-Control", "no-cache")
        reply.raw.setHeader("Connection", "keep-alive")

        reply.raw.write("event: start\ndata: streaming\n\n")

        try {
            await provider.stream({
                message,
                tenantId: request.tenant.name ?? "GIBRALTAR",
                onChunk: (chunk) => {
                        reply.raw.write(`data: ${chunk}\n\n`)
                    },
            })

            reply.raw.write("event: end\ndata: done\n\n")
            reply.raw.end()
        } catch (err) {
            console.error(err)
            reply.raw.end()
        }
    }
}