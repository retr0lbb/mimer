import { FastifyInstance } from "fastify";
import { TenantController } from "./tenant.controller.ts";
import { TenantService } from "./tenant.service.ts";
import { TenantRepository } from "./tenant.repository.ts";

export async function tenantRoutes(app: FastifyInstance){
    const repository = new TenantRepository()
    const service = new TenantService(repository)
    const controller = new TenantController(service)

    app.post("/tenants", controller.create)
}