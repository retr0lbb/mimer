import { OpenAIProvider } from "./openai.provider.ts";
import type { AIProvider } from "./ai.provider.interface.ts";
import { env } from "../../../config/env.ts";
import { GeminiProvider } from "./gemini.provider.ts";

export class ProviderFactory {
	constructor() {}
	create(providerName: string): AIProvider {
		switch (providerName) {
			case "gemini":
				if (!env.GEMINI_API_KEY) {
					throw new Error("API key not found");
				}
				return new GeminiProvider(env.GEMINI_API_KEY);
			case "openai":
				if (!env.OPENAI_API_KEY) {
					throw new Error("API key not found");
				}
				return new OpenAIProvider(env.OPENAI_API_KEY);
			default:
				throw new Error("Provider not supported");
		}
	}
}
