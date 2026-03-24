import type { ToolRepository } from "./tool.repository.ts";
import type { ToolDefinition } from "./tools.type.ts";

export class ToolRegistry {
	constructor(private toolRepository: ToolRepository) {}

	async getToolByName(
		tenantId: string,
		toolName: string,
	): Promise<ToolDefinition | null> {
		const tools = await this.getToolsForTenant(tenantId);

		return tools.find((t) => t.name === toolName) || null;
	}

	async getToolsForTenant(tenantId: string): Promise<ToolDefinition[]> {
		const tenantTools = await this.toolRepository.getToolByTenant(tenantId);

		if (!tenantTools) {
			throw new Error("Tools not found");
		}

		return tenantTools;
	}
}
