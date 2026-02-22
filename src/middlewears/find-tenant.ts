import fp from "fastify-plugin"
import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import { db } from "../db/index.ts"
import { tenants } from "../db/schemas/tenant.ts"
import { eq } from "drizzle-orm"

export async function findTenantPlugin(request: FastifyRequest, reply: FastifyReply) {
    try {
      const tenantId = request.headers["x-tenant-id"]
      if (!tenantId || typeof tenantId !== "string") {
        return reply.status(401).send({ error: "Missing tenant id" })
      }

      const result = await db
        .select()
        .from(tenants)
        .where(eq(tenants.apiKey, tenantId))

      if (!result || result.length !== 1) {
        return reply.status(404).send({ error: "Tenant not found" })
      }

      request.tenant = result[0]

    } catch (error) {
      console.error(error)
      return reply.status(500).send({ error: "Internal error" })
    }
}
