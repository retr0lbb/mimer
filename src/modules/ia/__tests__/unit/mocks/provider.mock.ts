export interface MockAIProvider {
	generate: jest.Mock<Promise<any>, [{ messages: any; tools?: any }]>;
	generateStream?: jest.Mock<
		Promise<any>,
		[{ messages: any; tools?: any; onChunk: (chunk: string) => void }]
	>;
}

export function createMockProvider(): MockAIProvider {
	return {
		generate: jest.fn(),
		generateStream: jest.fn(),
	};
}

export function createMockProviderWithTextResponse(
	text: string,
): MockAIProvider {
	return {
		generate: jest.fn().mockResolvedValue({
			text,
			finishReason: "stop",
		}),
		generateStream: jest.fn().mockResolvedValue({
			text,
			finishReason: "stop",
		}),
	};
}

export function createMockProviderWithToolCall(
	toolName: string,
	toolArgs: any,
	nextResponse?: any,
): MockAIProvider {
	return {
		generate: jest
			.fn()
			.mockResolvedValueOnce({
				toolCall: {
					id: "call_123",
					name: toolName,
					arguments: toolArgs,
				},
				finishReason: "tool_call",
			})
			.mockResolvedValueOnce(
				nextResponse || {
					text: "Tool executed successfully",
					finishReason: "stop",
				},
			),
		generateStream: jest.fn(),
	};
}

export function createMockProviderWithMultipleToolCalls(
	toolCalls: Array<{ name: string; arguments: any }>,
	finalText: string,
): MockAIProvider {
	const responses: any[] = toolCalls.map((tc) => ({
		toolCall: {
			id: `call_${tc.name}`,
			name: tc.name,
			arguments: tc.arguments,
		},
		finishReason: "tool_call",
	}));
	responses.push({
		text: finalText,
		finishReason: "stop",
	});

	return {
		generate: jest.fn().mockImplementation(() => {
			const response = responses.shift();
			return Promise.resolve(response!);
		}),
		generateStream: jest.fn(),
	};
}
