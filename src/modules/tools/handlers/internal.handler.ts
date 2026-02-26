import fs from "node:fs/promises";
import path from "node:path";

export const internalHandlers: Record<
	string,
	(args: any, config?: any) => Promise<any>
> = {
	async request_human_handoff(args) {
		return {
			status: "handoff_requested",
		};
	},

	async get_server_time() {
		return {
			time: new Date().toISOString(),
		};
	},

	async buscar_boleto(args) {
		const { nome, cpf } = args;

		if (!nome || !cpf) {
			return { error: "CPF and Name are required" };
		}

		const filepath = path.resolve("src/data/boletos.json");

		const raw = await fs.readFile(filepath, "utf-8");
		const boletos = JSON.parse(raw);

		const boleto = boletos.find(
			(b: any) => b.nome.toLowerCase() === nome.toLowerCase() && b.cpf === cpf,
		);

		if (!boleto) {
			return { error: "Boleto nao encontrado" };
		}

		return boleto;
	},
};
