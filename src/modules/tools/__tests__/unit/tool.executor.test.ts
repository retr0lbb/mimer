import { ToolExecutor } from "../../../tools/tool.executor.ts";
import type { ToolRegistry } from "../../../tools/tool.registry.ts";
import type { ToolDefinition } from "../../../tools/tools.type.ts";

describe("ToolExecutor", () => {
	let toolExecutor: ToolExecutor;
	let mockToolRegistry: jest.Mocked<ToolRegistry>;

	beforeEach(() => {
		mockToolRegistry = {
			getToolByName: jest.fn(),
			getToolsForTenant: jest.fn(),
		} as unknown as jest.Mocked<ToolRegistry>;
		toolExecutor = new ToolExecutor(mockToolRegistry);
	});

	describe("execute()", () => {
		const baseInput = {
			tenantId: "test-tenant",
			toolName: "test_tool",
			args: { foo: "bar" },
		};

		describe("should throw when tool not found", () => {
			it("when getToolByName returns null", async () => {
				mockToolRegistry.getToolByName.mockResolvedValue(null);

				await expect(toolExecutor.execute(baseInput)).rejects.toThrow(
					"Tool test_tool not implemented for tenant",
				);
			});
		});

		// describe("should execute internal handler", () => {
		// 	it("when handlerType is internal", async () => {
		// 		const mockHandler = jest.fn().mockReturnValue("handler result");
		// 		const tool: ToolDefinition = {
		// 			id: "1",
		// 			tenantId: "test-tenant",
		// 			name: "get_server_time",
		// 			description: "get_serve_current_timestamp",
		// 			schema: {},
		// 			handlerType: "internal",
		// 		};
		// 		mockToolRegistry.getToolByName.mockResolvedValue(tool);

		// 		const result = await toolExecutor.execute(baseInput);

		// 		expect(mockHandler).toHaveBeenCalledWith({ foo: "bar" }, undefined);
		// 		expect(result).toBe("handler result");
		// 	});
		// });

		// fix this test later

		describe("should throw when internal handler not implemented", () => {
			it("when handlerType is internal but tool name is not in InternalToolName enum", async () => {
				const tool: ToolDefinition = {
					id: "1",
					tenantId: "test-tenant",
					name: "test_tool",
					description: "test tool",
					schema: {},
					handlerType: "internal",
				};
				mockToolRegistry.getToolByName.mockResolvedValue(tool);

				await expect(toolExecutor.execute(baseInput)).rejects.toThrow(
					"Internal tool test_tool does not exist",
				);
			});

			it("when handlerType is internal but tool name does not exist", async () => {
				const tool: ToolDefinition = {
					id: "1",
					tenantId: "test-tenant",
					name: "nonexistent_tool",
					description: "nonexistent tool",
					schema: {},
					handlerType: "internal",
				};
				mockToolRegistry.getToolByName.mockResolvedValue(tool);

				await expect(toolExecutor.execute(baseInput)).rejects.toThrow(
					"Internal tool nonexistent_tool does not exist",
				);
			});
		});

		describe("should execute HTTP handler", () => {
			it("when handlerType is http", async () => {
				const tool: ToolDefinition = {
					id: "1",
					tenantId: "test-tenant",
					name: "test_tool",
					description: "test tool",
					schema: {},
					handlerType: "http",
					config: {
						url: "https://api.example.com/test",
						method: "POST",
					},
				};
				mockToolRegistry.getToolByName.mockResolvedValue(tool);

				global.fetch = jest.fn().mockResolvedValue({
					ok: true,
					json: jest.fn().mockResolvedValue({ result: "success" }),
				}) as jest.Mock;

				const result = await toolExecutor.execute(baseInput);

				expect(global.fetch).toHaveBeenCalledWith(
					"https://api.example.com/test",
					{
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ foo: "bar" }),
					},
				);
				expect(result).toEqual({ result: "success" });
			});
		});

		describe("should throw when HTTP call fails", () => {
			it("when handlerType is http and response is not ok", async () => {
				const tool: ToolDefinition = {
					id: "1",
					tenantId: "test-tenant",
					name: "test_tool",
					description: "test tool",
					schema: {},
					handlerType: "http",
					config: {
						url: "https://api.example.com/test",
						method: "POST",
					},
				};
				mockToolRegistry.getToolByName.mockResolvedValue(tool);

				global.fetch = jest.fn().mockResolvedValue({
					ok: false,
				}) as jest.Mock;

				await expect(toolExecutor.execute(baseInput)).rejects.toThrow(
					"HTTP call failed",
				);
			});
		});
	});
});
