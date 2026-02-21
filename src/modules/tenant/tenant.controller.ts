import { FastifyReply, FastifyRequest } from "fastify";
import { CreateTenantDTO } from "./tenant.dto.ts";
import { TenantService } from "./tenant.service.ts";

export class TenantController {
    constructor(private tenantService: TenantService){}

    create = async(request: FastifyRequest, reply: FastifyReply) => {
        try {
            const body = CreateTenantDTO.parse(request.body)
            const result = await this.tenantService.create(body)

            return reply.status(201).send(result)
        } catch (error) {
            console.log(error)
        }
    }
}