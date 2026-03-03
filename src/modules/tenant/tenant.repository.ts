import { eq } from "drizzle-orm";
import { db } from "../../db/index.ts";
import { tenants } from "../../db/schemas/tenant.ts";
import type { CreateTenantDTO } from "./tenant.dto.ts";

export class TenantRepository {
	async create(data: CreateTenantDTO): Promise<void> {
		await db.insert(tenants).values(data);
	}

	async findTenantById(tenantId: string) {
		const tenant = await db
			.select()
			.from(tenants)
			.where(eq(tenants.id, tenantId));

		if (!tenant) {
			throw new Error("not Found");
		}

		return tenant;
	}
}
