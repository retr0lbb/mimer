import { z } from "zod";

const jsonSchemaZod = z.object({
	type: z.literal("object"),
	properties: z.record(
		z.string(),
		z.object({
			type: z.enum(["string", "number", "boolean"]),
		}),
	),
	required: z.array(z.string()).optional(),
});

export const createToolSchema = z.object({
	name: z.string().min(1, "Name is required").max(100),

	description: z.string().min(1, "Description is required").max(500),

	schema: jsonSchemaZod,

	handlerType: z.enum(["internal", "http"]),

	config: z.any().optional(),
});

export type CreateToolDTO = z.infer<typeof createToolSchema> & {
	tenantId: string;
};
