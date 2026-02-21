import { TenantRepository } from "./tenant.repository.ts";
import type {CreateTenantDTO} from "./tenant.dto.ts"
import { randomUUID } from "node:crypto";

export class TenantService{
    constructor(private tenantRepository: TenantRepository){
        this.tenantRepository = tenantRepository
    }

    async create(body: Omit<CreateTenantDTO, "apiKey">){
        const apiKey = randomUUID()

        try {
            await this.tenantRepository.create({...body, apiKey})
            return {
                ok: true
            }
        } catch (error) {
            console.log(error)
            throw error
        }
    }
}