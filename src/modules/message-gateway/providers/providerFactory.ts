import type { MessageProvider } from "../types.ts";

export class MessageProviderFactory {
	create(channel: string): MessageProvider {
		switch (channel) {
			default:
				throw new Error("Provider not implemented");
		}
	}
}
