export interface AIMessage {
	role: "system" | "user" | "assistant" | "tool";
	content: string;
	tool_call_id?: string;
}

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
