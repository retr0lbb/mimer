import type { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../db/index.ts";
import { tenants } from "../db/schemas/tenant.ts";
import { eq } from "drizzle-orm";
import { UnauthorizedError, NotFoundError } from "../_errors/errors.ts";

export async function findTenantPlugin(
	request: FastifyRequest,
	_reply: FastifyReply,
) {
	const tenantId = request.headers["x-tenant-id"];
	if (!tenantId || typeof tenantId !== "string") {
		throw new UnauthorizedError("Missing tenant id");
	}

	const result = await db
		.select()
		.from(tenants)
		.where(eq(tenants.apiKey, tenantId));

	if (!result || result.length !== 1) {
		throw new NotFoundError("Tenant not found");
	}

	request.tenant = result[0];
}
