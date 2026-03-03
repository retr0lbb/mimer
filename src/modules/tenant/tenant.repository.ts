import { eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { tenants } from "../../db/schemas/tenant.ts";
import type { CreateTenantDTO } from "./tenant.dto.ts";
import { NotFoundError } from "../../_errors/errors.ts";

export class TenantRepository {
	async create(data: CreateTenantDTO): Promise<void> {
		await db.insert(tenants).values(data);
	}

	async findTenantById(tenantId: string) {
		const tenantsFound = await db
			.select()
			.from(tenants)
			.where(eq(tenants.id, tenantId));

		if (!tenantsFound || tenantsFound.length === 0) {
			throw new NotFoundError("Tenant not found");
		}

		return tenantsFound[0];
	}
}
