import { AIOrchestrator } from "../../ai.orchestrator.ts";
import type { ToolExecutor } from "../../../tools/tool.executor.ts";
import type { ToolRegistry } from "../../../tools/tool.registry.ts";
import type { ProviderFactory } from "../../providers/ai.provider.factory.ts";
import { createMockProviderFactory } from "./mocks/provider.factory.mock.ts";
import {
	createMockProviderWithTextResponse,
	createMockProviderWithToolCall,
	createMockProviderWithMultipleToolCalls,
} from "./mocks/provider.mock.ts";
import {
	createMockToolExecutorWithResult,
	createMockToolExecutorWithError,
} from "./mocks/tool.executor.mock.ts";
import {
	createMockToolRegistry,
	defaultTools,
} from "./mocks/tool.registry.mock.ts";

describe("AIOrchestrator", () => {
	let orchestrator: AIOrchestrator;

	describe("run()", () => {
		const baseInput = {
			tenantId: "test-tenant",
			providerName: "openai",
			messages: [{ role: "user" as const, content: "Hello" }],
		};

		describe("should return final response with text content", () => {
			it("when provider returns text without tool calls", async () => {
				const mockProvider = createMockProviderWithTextResponse(
					"Hello, how can I help you?",
				);
				const mockFactory = createMockProviderFactory(mockProvider);
				const mockToolExecutor = createMockToolExecutorWithResult(
					{},
				) as unknown as ToolExecutor;
				const mockToolRegistry = createMockToolRegistry(
					defaultTools,
				) as unknown as ToolRegistry;

				orchestrator = new AIOrchestrator(
					mockFactory as unknown as ProviderFactory,
					mockToolExecutor,
					mockToolRegistry,
				);

				const result = await orchestrator.run(baseInput);

				expect(result).toEqual({
					type: "final",
					content: "Hello, how can I help you?",
				});
				expect(mockProvider.generate).toHaveBeenCalledTimes(1);
				expect(mockToolExecutor.execute).not.toHaveBeenCalled();
			});
		});

		describe("should execute tool and return final response", () => {
			it("when provider returns a single tool call", async () => {
				const mockProvider = createMockProviderWithToolCall(
					"buscar_boleto",
					{ nome: "John", cpf: "12345678900" },
					{ text: "Boleto found", finishReason: "stop" },
				);
				const mockFactory = createMockProviderFactory(mockProvider);
				const mockToolExecutor = createMockToolExecutorWithResult({
					success: true,
				}) as unknown as ToolExecutor;
				const mockToolRegistry = createMockToolRegistry(
					defaultTools,
				) as unknown as ToolRegistry;

				orchestrator = new AIOrchestrator(
					mockFactory as unknown as ProviderFactory,
					mockToolExecutor,
					mockToolRegistry,
				);

				const result = await orchestrator.run(baseInput);

				expect(result).toEqual({
					type: "final",
					content: "Boleto found",
				});
				expect(mockToolExecutor.execute).toHaveBeenCalledWith({
					tenantId: "test-tenant",
					toolName: "buscar_boleto",
					args: { nome: "John", cpf: "12345678900" },
				});
				expect(mockProvider.generate).toHaveBeenCalledTimes(2);
			});
		});

		describe("should handle multiple tool calls", () => {
			it("when provider returns multiple tool calls (2 iterations)", async () => {
				const toolCalls = [
					{
						name: "buscar_boleto",
						arguments: { nome: "John", cpf: "12345678900" },
					},
					{
						name: "buscar_boleto",
						arguments: { nome: "Jane", cpf: "98765432100" },
					},
				];
				const mockProvider = createMockProviderWithMultipleToolCalls(
					toolCalls,
					"Both results found",
				);
				const mockFactory = createMockProviderFactory(mockProvider);
				const mockToolExecutor = createMockToolExecutorWithResult({
					success: true,
				}) as unknown as ToolExecutor;
				const mockToolRegistry = createMockToolRegistry(
					defaultTools,
				) as unknown as ToolRegistry;

				orchestrator = new AIOrchestrator(
					mockFactory as unknown as ProviderFactory,
					mockToolExecutor,
					mockToolRegistry,
				);

				const result = await orchestrator.run(baseInput);

				expect(result).toEqual({
					type: "final",
					content: "Both results found",
				});
				expect(mockToolExecutor.execute).toHaveBeenCalledTimes(2);
			});
		});

		describe("should throw error when max iterations exceeded", () => {
			it("when provider returns 5 tool calls", async () => {
				const toolCalls = Array(5).fill({
					name: "buscar_boleto",
					arguments: { nome: "John", cpf: "12345678900" },
				});
				const mockProvider = createMockProviderWithMultipleToolCalls(
					toolCalls,
					"Final",
				);
				const mockFactory = createMockProviderFactory(mockProvider);
				const mockToolExecutor = createMockToolExecutorWithResult({
					success: true,
				}) as unknown as ToolExecutor;
				const mockToolRegistry = createMockToolRegistry(
					defaultTools,
				) as unknown as ToolRegistry;

				orchestrator = new AIOrchestrator(
					mockFactory as unknown as ProviderFactory,
					mockToolExecutor,
					mockToolRegistry,
				);

				await expect(orchestrator.run(baseInput)).rejects.toThrow(
					"Too Many Interations",
				);
			});
		});

		describe("should propagate provider errors", () => {
			it("when provider.generate throws an error", async () => {
				const mockProvider = {
					generate: jest.fn().mockRejectedValue(new Error("Provider error")),
					generateStream: jest.fn(),
				};
				const mockFactory = createMockProviderFactory(mockProvider);
				const mockToolExecutor = createMockToolExecutorWithResult(
					{},
				) as unknown as ToolExecutor;
				const mockToolRegistry = createMockToolRegistry(
					defaultTools,
				) as unknown as ToolRegistry;

				orchestrator = new AIOrchestrator(
					mockFactory as unknown as ProviderFactory,
					mockToolExecutor,
					mockToolRegistry,
				);

				await expect(orchestrator.run(baseInput)).rejects.toThrow(
					"Provider error",
				);
			});
		});

		describe("should propagate tool executor errors", () => {
			it("when toolExecutor.execute throws an error", async () => {
				const mockProvider = createMockProviderWithToolCall("buscar_boleto", {
					nome: "John",
					cpf: "12345678900",
				});
				const mockFactory = createMockProviderFactory(mockProvider);
				const mockToolExecutor = createMockToolExecutorWithError(
					new Error("Tool execution failed"),
				) as unknown as ToolExecutor;
				const mockToolRegistry = createMockToolRegistry(
					defaultTools,
				) as unknown as ToolRegistry;

				orchestrator = new AIOrchestrator(
					mockFactory as unknown as ProviderFactory,
					mockToolExecutor,
					mockToolRegistry,
				);

				await expect(orchestrator.run(baseInput)).rejects.toThrow(
					"Tool execution failed",
				);
			});
		});
	});

	describe("runStream()", () => {
		const baseInput = {
			tenantId: "test-tenant",
			providerName: "openai",
			messages: [{ role: "user" as const, content: "Hello" }],
			onChunk: jest.fn(),
		};

		describe("should throw when provider doesn't support streaming", () => {
			it("when provider.generateStream is undefined", async () => {
				const mockProvider = {
					generate: jest.fn(),
					generateStream: undefined,
				};
				const mockFactory = createMockProviderFactory(mockProvider);
				const mockToolExecutor = createMockToolExecutorWithResult(
					{},
				) as unknown as ToolExecutor;
				const mockToolRegistry = createMockToolRegistry(
					defaultTools,
				) as unknown as ToolRegistry;

				orchestrator = new AIOrchestrator(
					mockFactory as unknown as ProviderFactory,
					mockToolExecutor,
					mockToolRegistry,
				);

				await expect(orchestrator.runStream(baseInput)).rejects.toThrow(
					"Stream not supported by provider",
				);
			});
		});

		describe("should delegate to run() when tools are provided", () => {
			it("when input has tools, delegates to run()", async () => {
				const mockProvider =
					createMockProviderWithTextResponse("Streamed response");
				const mockFactory = createMockProviderFactory(mockProvider);
				const mockToolExecutor = createMockToolExecutorWithResult(
					{},
				) as unknown as ToolExecutor;
				const mockToolRegistry = createMockToolRegistry(
					defaultTools,
				) as unknown as ToolRegistry;

				orchestrator = new AIOrchestrator(
					mockFactory as unknown as ProviderFactory,
					mockToolExecutor,
					mockToolRegistry,
				);

				const inputWithTools = {
					...baseInput,
					tools: [{ name: "buscar_boleto", description: "test", schema: {} }],
				};

				const result = await orchestrator.runStream(inputWithTools);

				expect(result).toEqual({
					type: "final",
					content: "Streamed response",
				});
			});
		});

		describe("should use generateStream when no tools provided", () => {
			it("when input has no tools, uses provider.generateStream", async () => {
				const mockProvider = {
					generate: jest.fn(),
					generateStream: jest.fn().mockResolvedValue({
						text: "Streamed content",
						finishReason: "stop",
					}),
				};
				const mockFactory = createMockProviderFactory(mockProvider);
				const mockToolExecutor = createMockToolExecutorWithResult(
					{},
				) as unknown as ToolExecutor;
				const mockToolRegistry = createMockToolRegistry(
					defaultTools,
				) as unknown as ToolRegistry;

				orchestrator = new AIOrchestrator(
					mockFactory as unknown as ProviderFactory,
					mockToolExecutor,
					mockToolRegistry,
				);

				const onChunk = jest.fn();
				const result = await orchestrator.runStream({ ...baseInput, onChunk });

				expect(mockProvider.generateStream).toHaveBeenCalled();
				expect(result).toEqual({
					type: "final",
					content: "Streamed content",
				});
			});
		});

		describe("should propagate stream errors", () => {
			it("when generateStream throws an error", async () => {
				const mockProvider = {
					generate: jest.fn(),
					generateStream: jest
						.fn()
						.mockRejectedValue(new Error("Stream error")),
				};
				const mockFactory = createMockProviderFactory(mockProvider);
				const mockToolExecutor = createMockToolExecutorWithResult(
					{},
				) as unknown as ToolExecutor;
				const mockToolRegistry = createMockToolRegistry(
					defaultTools,
				) as unknown as ToolRegistry;

				orchestrator = new AIOrchestrator(
					mockFactory as unknown as ProviderFactory,
					mockToolExecutor,
					mockToolRegistry,
				);

				await expect(orchestrator.runStream(baseInput)).rejects.toThrow(
					"Stream error",
				);
			});
		});
	});
});
