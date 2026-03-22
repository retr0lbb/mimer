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
		// return this.toolRepository.findByTenant(tenantId); // for later with DB

		return [
			{
				id: "1",
				tenantId,
				name: "buscar_boleto",
				description: "busca um boleto em json pelo nome e cpf de uma pessoa",
				schema: {
					type: "object",
					properties: {
						nome: { type: "string" },
						cpf: { type: "string" },
					},
					required: ["nome", "cpf"],
				},
				handlerType: "internal",
			},
		];
	}
}
