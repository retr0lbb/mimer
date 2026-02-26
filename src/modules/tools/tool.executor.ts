import { internalHandlers } from "./handlers/internal.handler.ts";
import type { ToolRegistry } from "./tool.registry.ts";

export class ToolExecutor {
	constructor(private toolRegistry: ToolRegistry) {}

	async execute(input: { tenantId: string; toolName: string; args: any }) {
		const tool = await this.toolRegistry.getToolByName(
			input.tenantId,
			input.toolName,
		);

		if (!tool) {
			throw new Error(`Tool ${input.toolName} not implemented for tenant`);
		}

		switch (tool.handlerType) {
			case "internal":
				return this.executeInternal(tool, input.args);

			case "http":
				return this.executeHttp(tool, input.args);

			default:
				throw new Error("Unsuported Tool Handler Type");
		}
	}

	private async executeInternal(tool: any, args: any) {
		const handler = internalHandlers[tool.name];

		if (!handler) {
			throw new Error("Internal Handler not implemented yet");
		}

		return handler(args, tool.config);
	}

	private async executeHttp(tool: any, args: any) {
		const response = await fetch(tool.config.url, {
			method: tool.config.method || "POST",
			headers: {
				"Content-Type": "application/json",
				...(tool.config.headers || {}),
			},
			body: JSON.stringify(args),
		});

		if (!response.ok) {
			throw new Error("HTTP call failed");
		}

		return await response.json();
	}
}
