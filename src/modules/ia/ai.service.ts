import { FastifyReply, FastifyRequest } from "fastify";
import { aiProviderFactory } from "./ai.provider.factory.ts";


export class AIService{
    async chat(request: FastifyRequest, message: string){
        const tenant = "test.mock"

        const provider = aiProviderFactory()

        const response = await provider.chat({
            message,
            tenantId: tenant
        })

        return response
    }

    async stream(request: FastifyRequest, message: string, reply: FastifyReply) {
        const provider = aiProviderFactory()

        if (!provider.stream) {
            throw new Error("Stream not implemented for this provider")
        }

        // 👇 MUITO IMPORTANTE
        reply.hijack()

        reply.raw.setHeader("Content-Type", "text/event-stream")
        reply.raw.setHeader("Cache-Control", "no-cache")
        reply.raw.setHeader("Connection", "keep-alive")

        reply.raw.write("event: start\ndata: streaming\n\n")

        try {
            await provider.stream({
                message,
                tenantId: "test11",
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