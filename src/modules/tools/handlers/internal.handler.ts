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

	async searchBills(args) {
		const { name, cpf } = args;

		if (!name || !cpf) {
			return { error: "CPF and Name are required" };
		}

		const filepath = path.resolve("scr/data/boletos.json");

		const raw = await fs.readFile(filepath, "utf-8");
		const boletos = JSON.parse(raw);

		const boleto = boletos.find(
			(b: any) => b.nome.toLowerCase() === name.toLowerCase() && b.cpf === cpf,
		);

		if (!boleto) {
			return { error: "Boleto nao encontrado" };
		}

		return boleto;
	},
};
