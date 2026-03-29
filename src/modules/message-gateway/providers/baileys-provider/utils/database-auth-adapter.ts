import { type AuthenticationState, initAuthCreds } from "baileys";
import type { AuthStateRepository } from "../types/auth-state.repository.ts";
import { DatabaseSignalKeyStore } from "../signal-key-store.ts";

export class BaileysAuthStateManager {
	constructor(private readonly repository: AuthStateRepository) {}

	async getState(tenantId: string): Promise<{
		state: AuthenticationState;
		saveCreds: () => Promise<void>;
	}> {
		const persisted = await this.repository.findByTenantId(tenantId);

		const creds = persisted?.creds ?? initAuthCreds();
		const rawKeys = persisted?.keys ?? {};

		if (!persisted) {
			await this.repository.create(tenantId, { creds, keys: rawKeys });
		}

		const keyStore = new DatabaseSignalKeyStore(rawKeys);

		const saveCreds = async (): Promise<void> => {
			await this.repository.update(tenantId, {
				creds,
				keys: keyStore.toJSON(),
			});
		};

		keyStore.onKeysUpdated = saveCreds;

		const state: AuthenticationState = { creds, keys: keyStore };

		return { state, saveCreds };
	}
}
