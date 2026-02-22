import type { FastifyInstance } from "fastify";
import { db } from "../db/index.ts"
import {tenants} from "../db/schemas/tenant.ts"
import { eq } from "drizzle-orm";

export async function findTenantPlugin(app: FastifyInstance){
    app.addHook("preHandler", async (req, rep) => {
        try {
            const tenantId = req.headers["x-tenant-id"]

            if(!tenantId){
                throw new Error("Tenant not found")
            }

            if(typeof tenantId !== "string" ){
                throw new Error("More than one tenant id passed")
            }

            const tenant = await db.select().from(tenants).where(eq(tenants.apiKey, tenantId))

            if(!tenant || tenant.length > 1){
                throw new Error("Tenant not found or duplicated tenants found")
            }

            return { tenant }
            
        } catch (error) {
            console.log(error)
            return rep.status(500).send({error})
        }
    })
}