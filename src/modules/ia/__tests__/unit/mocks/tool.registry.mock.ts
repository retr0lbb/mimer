export interface ToolDefinition {
	id: string;
	tenantId: string;
	name: string;
	description: string;
	schema: any;
	handlerType: "internal" | "http";
}

export interface MockToolRegistry {
	getToolsForTenant: jest.Mock<Promise<ToolDefinition[]>, [string]>;
	getToolByName: jest.Mock<Promise<ToolDefinition | null>, [string, string]>;
}

export function createMockToolRegistry(
	tools: ToolDefinition[] = [],
): MockToolRegistry {
	return {
		getToolsForTenant: jest.fn().mockResolvedValue(tools),
		getToolByName: jest.fn(),
	};
}

export const defaultTools: ToolDefinition[] = [
	{
		id: "1",
		tenantId: "test-tenant",
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
