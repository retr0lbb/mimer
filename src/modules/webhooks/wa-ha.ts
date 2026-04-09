import type { FastifyInstance } from "fastify";

export async function wahaWebHook(app: FastifyInstance) {
	app.post("/webhook/waha", async (request, reply) => {
		reply.status(500).send({ message: "Webhook yet not implemented" });
	});
}
