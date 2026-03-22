import fs from "node:fs/promises";
import path from "node:path";
import type { z } from "zod";
import {
	InternalToolName,
	InternalToolSchemas,
	INTERNAL_TOOL_NAMES,
	type InternalTool,
	type InternalToolInput,
	type InternalToolOutput,
} from "../types/internal-tool.type.ts";

export { INTERNAL_TOOL_NAMES };

const createInternalTool = <
	T extends InternalToolName,
	Input extends z.ZodType<any>,
	Output extends z.ZodType<any>,
>(
	tool: InternalTool<T, Input, Output>,
): InternalTool<T, Input, Output> => tool;

export const internalTools = {
	[InternalToolName.REQUEST_HUMAN_HANDOFF]: createInternalTool({
		name: InternalToolName.REQUEST_HUMAN_HANDOFF,
		description: "Request a human handoff for the current conversation",
		inputSchema:
			InternalToolSchemas[InternalToolName.REQUEST_HUMAN_HANDOFF].input,
		returnSchema:
			InternalToolSchemas[InternalToolName.REQUEST_HUMAN_HANDOFF].output,
		handler: async (): Promise<
			InternalToolOutput<InternalToolName.REQUEST_HUMAN_HANDOFF>
		> => {
			return {
				status: "handoff_requested",
			};
		},
	}),

	[InternalToolName.GET_SERVER_TIME]: createInternalTool({
		name: InternalToolName.GET_SERVER_TIME,
		description: "Get the current server time",
		inputSchema: InternalToolSchemas[InternalToolName.GET_SERVER_TIME].input,
		returnSchema: InternalToolSchemas[InternalToolName.GET_SERVER_TIME].output,
		handler: async (): Promise<
			InternalToolOutput<InternalToolName.GET_SERVER_TIME>
		> => {
			return {
				time: new Date().toISOString(),
			};
		},
	}),

	[InternalToolName.BUSCAR_BOLETO]: createInternalTool({
		name: InternalToolName.BUSCAR_BOLETO,
		description: "Busca um boleto em json pelo nome e cpf de uma pessoa",
		inputSchema: InternalToolSchemas[InternalToolName.BUSCAR_BOLETO].input,
		returnSchema: InternalToolSchemas[InternalToolName.BUSCAR_BOLETO].output,
		handler: async (
			args: InternalToolInput<InternalToolName.BUSCAR_BOLETO>,
		): Promise<InternalToolOutput<InternalToolName.BUSCAR_BOLETO>> => {
			const { nome, cpf } = args;

			if (!nome || !cpf) {
				return { error: "CPF and Name are required" };
			}

			const filepath = path.resolve("src/data/boletos.json");

			const raw = await fs.readFile(filepath, "utf-8");
			const boletos = JSON.parse(raw);

			const boleto = boletos.find(
				(b: any) =>
					b.nome.toLowerCase() === nome.toLowerCase() && b.cpf === cpf,
			);

			if (!boleto) {
				return { error: "Boleto nao encontrado" };
			}

			return {
				nome: boleto.nome,
				cpf: boleto.cpf,
				valor: boleto.valor,
				vencimento: boleto.vencimento,
			};
		},
	}),
} as const;

export type InternalToolKey = keyof typeof internalTools;

export const internalHandlers: Record<
	InternalToolKey,
	(args: any, config?: any) => Promise<any>
> = {
	[InternalToolName.REQUEST_HUMAN_HANDOFF]:
		internalTools[InternalToolName.REQUEST_HUMAN_HANDOFF].handler,
	[InternalToolName.GET_SERVER_TIME]:
		internalTools[InternalToolName.GET_SERVER_TIME].handler,
	[InternalToolName.BUSCAR_BOLETO]:
		internalTools[InternalToolName.BUSCAR_BOLETO].handler,
};
