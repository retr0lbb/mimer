import { eq } from "drizzle-orm";
import { BufferJSON } from "baileys";
import { db } from "../../../../../db/index.ts";
import { credentials } from "@src/db/schemas/credentials.ts";
import type {
	AuthStateRepository,
	PersistedAuthState,
} from "../types/auth-state.repository.ts";

const BINARY_FIELDS = new Set([
	"public",
	"private",
	"signature",
	"identifierKey",
	"ephemeral",
]);

function isBufferLikeObject(
	value: unknown,
): value is { type: "Buffer"; data: number[] | string } {
	return (
		typeof value === "object" &&
		value !== null &&
		"type" in value &&
		(value as Record<string, unknown>).type === "Buffer" &&
		"data" in value
	);
}

function restoreBuffers<T>(obj: T, fieldName?: string): T {
	if (obj === null || obj === undefined) {
		return obj;
	}

	if (isBufferLikeObject(obj)) {
		const data = obj.data;
		if (typeof data === "string") {
			return Buffer.from(data, "base64") as unknown as T;
		}
		return Buffer.from(data) as unknown as T;
	}

	if (typeof obj === "string" && fieldName && BINARY_FIELDS.has(fieldName)) {
		return Buffer.from(obj, "base64") as unknown as T;
	}

	if (Array.isArray(obj)) {
		return obj.map((item) => restoreBuffers(item)) as unknown as T;
	}

	if (typeof obj === "object") {
		const restored: Record<string, unknown> = {};
		for (const key of Object.keys(obj)) {
			restored[key] = restoreBuffers(
				(obj as Record<string, unknown>)[key],
				key,
			);
		}
		return restored as T;
	}

	return obj;
}

function normalizeForStorage(obj: unknown): unknown {
	return JSON.parse(JSON.stringify(obj, BufferJSON.replacer));
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
			creds: normalizeForStorage(state.creds),
			keys: normalizeForStorage(state.keys),
		});
	}

	async update(tenantId: string, state: PersistedAuthState): Promise<void> {
		await db
			.update(credentials)
			.set({
				creds: normalizeForStorage(state.creds),
				keys: normalizeForStorage(state.keys),
			})
			.where(eq(credentials.tenantId, tenantId));
	}
}
