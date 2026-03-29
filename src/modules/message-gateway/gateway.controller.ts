import type { FastifyReply, FastifyRequest } from "fastify";
import type { BaileysProvider } from "./providers/baileys-provider/baileys.ts";

export class MessageGatewayController {
	constructor(private readonly baileysProvider: BaileysProvider) {}

	getQrCode = async (_request: FastifyRequest, reply: FastifyReply) => {
		const qr = this.baileysProvider.getQrCode();
		const status = this.baileysProvider.getConnectionStatus();

		if (status === "open") {
			return reply.status(200).send({
				status: "connected",
				qr: null,
			});
		}

		if (!qr) {
			return reply.status(202).send({
				status: "awaiting_qr",
				qr: null,
			});
		}

		return reply.status(200).send({
			status: "pending",
			qr,
		});
	};

	initConnection = async (request: FastifyRequest, reply: FastifyReply) => {
		const {id} = request.tenant;

		await this.baileysProvider.initConnection(id);

		return reply.status(200).send({ status: "connecting" });
	};
}
