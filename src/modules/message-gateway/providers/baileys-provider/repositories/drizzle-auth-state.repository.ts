import { eq } from "drizzle-orm";
import { db } from "../../../../../db/index.ts";
import { credentials } from "@src/db/schemas/credentials.ts";
import type {
	AuthStateRepository,
	PersistedAuthState,
} from "../types/auth-state.repository.ts";

export class DrizzleAuthStateRepository implements AuthStateRepository {
	async findByTenantId(tenantId: string): Promise<PersistedAuthState | null> {
		const [session] = await db
			.select()
			.from(credentials)
			.where(eq(credentials.tenantId, tenantId))
			.limit(1);

		if (!session) {
			return null;
		}

		return session as unknown as PersistedAuthState;
	}

	async create(tenantId: string, state: PersistedAuthState): Promise<void> {
		await db.insert(credentials).values({
			tenantId,
			creds: state.creds,
			keys: state.keys,
		});
	}

	async update(tenantId: string, state: PersistedAuthState): Promise<void> {
		await db
			.update(credentials)
			.set({ creds: state.creds, keys: state.keys })
			.where(eq(credentials.tenantId, tenantId));
	}
}
