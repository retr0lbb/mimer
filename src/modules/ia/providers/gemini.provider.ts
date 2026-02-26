import { randomUUID } from "node:crypto";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIMessage, AITool, AIProviderResponse } from "../ai.types.ts";
import type { AIProvider } from "./ai.provider.interface.ts";

export class GeminiProvider implements AIProvider {
	private client: GoogleGenerativeAI;

	constructor(googleApiKey: string) {
		this.client = new GoogleGenerativeAI(googleApiKey);
	}

	private mapMessages(messages: AIMessage[]) {
		return messages.map((m: any) => {
			if (m.role === "tool") {
				return {
					role: "function",
					parts: [
						{
							functionResponse: {
								name: m.name,
								response: JSON.parse(m.content),
							},
						},
					],
				};
			}

			return {
				role: m.role === "assistant" ? "model" : m.role,
				parts: [{ text: m.content }],
			};
		});
	}

	private mapTools(tools?: AITool[]) {
		if (!tools || tools.length === 0) return undefined;

		return tools.map((tool) => ({
			name: tool.name,
			description: tool.description,
			parameters: tool.schema,
		}));
	}

	async generate(input: {
		messages: AIMessage[];
		tools?: AITool[];
		stream?: boolean;
	}): Promise<AIProviderResponse> {
		console.log(input.tools);
		const model = this.client.getGenerativeModel({
			model: "gemini-2.5-flash-lite",
			tools: input.tools
				? [{ functionDeclarations: this.mapTools(input.tools) }]
				: undefined,
		});

		const result = await model.generateContent({
			contents: this.mapMessages(input.messages),
		});

		const response = result.response;
		const candidate = response.candidates?.[0];

		if (!candidate) {
			throw new Error("No response from gemini");
		}

		const functionPart = candidate.content.parts?.find(
			(p: any) => p.functionCall,
		);

		if (functionPart?.functionCall) {
			return {
				finishReason: "tool_call",
				toolCall: {
					id: randomUUID(),
					name: functionPart.functionCall.name,
					arguments: functionPart.functionCall.args,
				},
			};
		}

		return {
			finishReason: "stop",
			text: response.text(),
		} as AIProviderResponse;
	}

	async generateStream(input: {
		messages: AIMessage[];
		tools?: AITool[];
		onChunk: (chunk: string) => void;
	}): Promise<AIProviderResponse> {
		const model = this.client.getGenerativeModel({
			model: "gemini-2.5-flash-lite",
			tools: input.tools
				? [{ functionDeclarations: this.mapTools(input.tools) }]
				: undefined,
		});

		const result = await model.generateContentStream({
			contents: this.mapMessages(input.messages),
		});

		let fullText = "";

		for await (const chunk of result.stream) {
			const text = chunk.text();

			if (!text) continue;

			fullText += text;
			input.onChunk(text);
		}

		return {
			finishReason: "stop",
			text: fullText,
		};
	}
}
