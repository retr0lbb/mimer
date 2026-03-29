import type { AuthenticationCreds } from "baileys";

export interface PersistedAuthState {
	readonly creds: AuthenticationCreds;
	readonly keys: Record<string, Record<string, unknown>>;
}

export interface AuthStateRepository {
	findByTenantId(tenantId: string): Promise<PersistedAuthState | null>;
	create(tenantId: string, state: PersistedAuthState): Promise<void>;
	update(tenantId: string, state: PersistedAuthState): Promise<void>;
}
