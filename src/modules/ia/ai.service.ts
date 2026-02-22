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
}