import { eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { tenants } from "../../db/schemas/tenant.ts";
import { NotFoundError } from "../../_errors/errors.ts";
import { tools } from "../../db/schemas/tools.ts";
import type { CreateToolDTO } from "./dto/create-too.dto.ts";

export class ToolRepository {
	async getToolByTenant(tenantId: string) {
		const tenantTools = await db
			.select()
			.from(tools)
			.where(eq(tools.tenantId, tenantId));

		if (!tools) {
			throw new NotFoundError(`Tools from tenant ${tenantId} not found`);
		}

		return tenantTools;
	}

	async saveTool(data: CreateToolDTO) {
		const tenant = await db
			.select({ id: tenants.id })
			.from(tenants)
			.where(eq(tenants.id, data.tenantId));

		if (!tenant || tenant.length > 1) {
			throw new NotFoundError("Tenant not found");
		}

		const tool = await db
			.insert(tools)
			.values({
				description: data.description,
				handlerType: data.handlerType,
				name: data.name,
				tenantId: data.tenantId,
				schema: data.schema,
				config: data.config,
			})
			.returning();

		return tool;
	}
}
