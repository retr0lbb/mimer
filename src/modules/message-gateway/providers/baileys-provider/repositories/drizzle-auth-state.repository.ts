import { eq } from "drizzle-orm";
import { db } from "../../../../../db/index.ts";
import { credentials } from "@src/db/schemas/credentials.ts";
import type {
	AuthStateRepository,
	PersistedAuthState,
} from "../types/auth-state.repository.ts";

function isBufferLike(value: unknown): value is { type: "Buffer"; data: number[] } {
	return (
		typeof value === "object" &&
		value !== null &&
		"type" in value &&
		(value as Record<string, unknown>).type === "Buffer" &&
		"data" in value &&
		Array.isArray((value as Record<string, unknown>).data)
	);
}

function restoreBuffers<T>(obj: T): T {
	if (obj === null || obj === undefined) {
		return obj;
	}

	if (isBufferLike(obj)) {
		return Buffer.from(obj.data) as unknown as T;
	}

	if (Array.isArray(obj)) {
		return obj.map(restoreBuffers) as unknown as T;
	}

	if (typeof obj === "object") {
		const restored: Record<string, unknown> = {};
		for (const key of Object.keys(obj)) {
			restored[key] = restoreBuffers((obj as Record<string, unknown>)[key]);
		}
		return restored as T;
	}

	return obj;
}

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

		return {
			creds: restoreBuffers(session.creds),
			keys: restoreBuffers(session.keys),
		} as unknown as PersistedAuthState;
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
