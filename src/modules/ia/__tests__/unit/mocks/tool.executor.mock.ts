export interface MockToolExecutor {
	execute: jest.Mock<
		Promise<any>,
		[{ tenantId: string; toolName: string; args: any }]
	>;
}

export function createMockToolExecutor(): MockToolExecutor {
	return {
		execute: jest.fn(),
	};
}

export function createMockToolExecutorWithResult(
	result: any,
): MockToolExecutor {
	return {
		execute: jest.fn().mockResolvedValue(result),
	};
}

export function createMockToolExecutorWithError(
	error: Error,
): MockToolExecutor {
	return {
		execute: jest.fn().mockRejectedValue(error),
	};
}
