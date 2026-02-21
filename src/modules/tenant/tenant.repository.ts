import {db} from "../../db/index.ts"
import { tenants } from "../../db/schemas/tenant.ts"
import type { CreateTenantDTO } from "./tenant.dto.ts"

export class TenantRepository{
    constructor(){}
    
    async create(data: CreateTenantDTO): Promise<void>{
        await db.insert(tenants).values(data);
    }
}