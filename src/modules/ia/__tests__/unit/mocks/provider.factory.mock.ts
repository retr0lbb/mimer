import type { MockAIProvider } from "./provider.mock.ts";

export interface MockProviderFactory {
	create: jest.Mock<MockAIProvider, [string]>;
}

export function createMockProviderFactory(
	mockProvider: MockAIProvider,
): MockProviderFactory {
	return {
		create: jest.fn().mockReturnValue(mockProvider),
	};
}
