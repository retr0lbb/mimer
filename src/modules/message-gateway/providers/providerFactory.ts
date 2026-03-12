import { MessageProvider } from "../types.ts";
import { WhatsAppProvider } from "./whatsappProvider.ts";

export class MessageProviderFactory {
	create(channel: string): MessageProvider {
		switch (channel) {
			case "wpp":
				return new WhatsAppProvider();

			default:
				throw new Error("Provider not implemented");
		}
	}
}
