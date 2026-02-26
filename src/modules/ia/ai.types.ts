export type AIMessage =
	| {
			role: "user" | "assistant" | "system";
			content: string;
	  }
	| {
			role: "tool";
			content: string;
			name: string;
	  };

export interface AITool {
	name: string;
	description: string;
	schema: any;
}

export interface AIToolCall {
	id: string;
	name: string;
	arguments: any;
}

export interface AIProviderResponse {
	text?: string;
	toolCall?: AIToolCall;
	finishReason: "stop" | "tool_call";
}
