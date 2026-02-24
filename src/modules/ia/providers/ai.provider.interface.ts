import type { AIMessage, AIProviderResponse, AITool } from "../ai.types.ts";

export interface AIProvider {
	generate(input: {
		messages: AIMessage[];
		tools?: AITool[];
	}): Promise<AIProviderResponse>;

	generateStream?(input: {
		messages: AIMessage[];
		tools?: AITool[];
		onChunk: (chunk: string) => void;
	}): Promise<AIProviderResponse>;
}
