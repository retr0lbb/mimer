import type { MessageProvider } from "../types.ts";
import { BaileysProvider } from "./baileys-provider/baileys.ts";
import { DrizzleAuthStateRepository } from "./baileys-provider/repositories/drizzle-auth-state.repository.ts";
import { BaileysAuthStateManager } from "./baileys-provider/utils/database-auth-adapter.ts";

export class MessageProviderFactory {
	create(channel: string): MessageProvider {
		switch (channel) {
			case "wpp":
				const stateManager = new BaileysAuthStateManager(new DrizzleAuthStateRepository())
				return new BaileysProvider(stateManager);

			default:
				throw new Error("Provider not implemented");
		}
	}
}
