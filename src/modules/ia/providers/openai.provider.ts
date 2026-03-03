import type { AIMessage, AITool, AIProviderResponse } from "../ai.types.ts";
import type { AIProvider } from "./ai.provider.interface.ts";
import OpenAI from "openai";
import { logger } from "../../../utils/logger.ts";

export class OpenAIProvider implements AIProvider {
	private client: OpenAI;

	constructor(openIaKey: string) {
		this.client = new OpenAI({ apiKey: openIaKey });
	}

	async generate(input: {
		messages: AIMessage[];
		tools?: AITool[];
		stream?: boolean;
	}): Promise<AIProviderResponse> {
		logger.debug({ client: this.client, input }, "openai.generate called");
		throw new Error("NOT Implemented");
	}
}
