import type { CreateToolDTO } from "./dto/create-too.dto.ts";
import type { ToolRepository } from "./tool.repository.ts";

export class ToolService {
	constructor(private readonly toolRepository: ToolRepository) {}

	async createTool(data: CreateToolDTO) {
		return await this.toolRepository.saveTool(data);
	}

	async findToolsByTenant(tenantId: string) {
		const tools = await this.toolRepository.getToolByTenant(tenantId);

		return tools;
	}
}
