import type { FastifyInstance } from "fastify";
import { MessageGatewayController } from "./gateway.controller.ts";
import { BaileysProvider } from "./providers/baileys-provider/baileys.ts";
import { BaileysAuthStateManager } from "./providers/baileys-provider/utils/database-auth-adapter.ts";
import { DrizzleAuthStateRepository } from "./providers/baileys-provider/repositories/drizzle-auth-state.repository.ts";
import { findTenantPlugin } from "@src/middlewares/find-tenant.ts";

export async function gatewayRoutes(app: FastifyInstance) {
	const repository = new DrizzleAuthStateRepository();
	const authStateManager = new BaileysAuthStateManager(repository);
	const baileysProvider = new BaileysProvider(authStateManager);

	const controller = new MessageGatewayController(baileysProvider);

	app.post("/gateway/connect", { preHandler: [findTenantPlugin] }, controller.initConnection);
	app.get("/gateway/qrcode", controller.getQrCode);
}
