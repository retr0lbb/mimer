import type { FastifyReply, FastifyRequest } from "fastify";
import type { ToolService } from "./tool.service.ts";
import { createToolSchema } from "./dto/create-too.dto.ts";
import z from "zod";

export class ToolController {
	constructor(private readonly toolService: ToolService) {}
	create = async (req: FastifyRequest, res: FastifyReply) => {
		const tenantId = req.tenant.id;

		const { description, handlerType, name, schema, config } =
			createToolSchema.parse(req.body);

		const tool = await this.toolService.createTool({
			description,
			handlerType,
			name,
			schema,
			tenantId,
			config,
		});

		return res
			.status(201)
			.send({ message: "Tool saved with success in database", tool });
	};

	listByTenant = async (req: FastifyRequest, res: FastifyReply) => {
		const paramsSchema = z.object({
			id: z.uuid(),
		});

		const { id } = paramsSchema.parse(req.params);

		const tools = await this.toolService.findToolsByTenant(id);

		return res.status(200).send({ tools: tools });
	};
}
