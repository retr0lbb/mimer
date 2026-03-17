import { z } from "zod";

export enum InternalToolName {
	REQUEST_HUMAN_HANDOFF = "request_human_handoff",
	GET_SERVER_TIME = "get_server_time",
	BUSCAR_BOLETO = "buscar_boleto",
}

export const InternalToolSchemas = {
	[InternalToolName.REQUEST_HUMAN_HANDOFF]: {
		input: z.object({}),
		output: z.object({
			status: z.literal("handoff_requested"),
		}),
	},
	[InternalToolName.GET_SERVER_TIME]: {
		input: z.object({}),
		output: z.object({
			time: z.string().datetime(),
		}),
	},
	[InternalToolName.BUSCAR_BOLETO]: {
		input: z.object({
			nome: z.string().min(1, "Nome is required"),
			cpf: z.string().min(1, "CPF is required"),
		}),
		output: z.object({
			error: z.string().optional(),
			nome: z.string().optional(),
			cpf: z.string().optional(),
			valor: z.number().optional(),
			vencimento: z.string().optional(),
		}),
	},
};

export type InternalToolInput<T extends InternalToolName> =
	(typeof InternalToolSchemas)[T]["input"]["_output"];

export type InternalToolOutput<T extends InternalToolName> =
	(typeof InternalToolSchemas)[T]["output"]["_output"];

export interface InternalTool<
	T extends InternalToolName,
	Input extends z.ZodType = z.ZodType,
	Output extends z.ZodType = z.ZodType,
> {
	name: T;
	description: string;
	inputSchema: Input;
	returnSchema: Output;
	handler: (
		args: z.infer<Input>,
		config?: any,
	) => Promise<z.infer<Output>>;
}

export const INTERNAL_TOOL_NAMES = Object.values(InternalToolName) as readonly string[];
