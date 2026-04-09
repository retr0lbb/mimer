import fastify from "fastify";
import { tenantRoutes } from "./modules/tenant/tenant.route.ts";
import { toolRoutes } from "./modules/tools/tools.routes.ts";
import { errorHandler } from "./_errors/handlers.ts";
import { logToFile } from "./utils/logger.ts";
import { conversationRoutes } from "./modules/conversation/conversation.route.ts";
import { wahaWebHook } from "./modules/webhooks/wa-ha.ts";
import { env } from "./config/env.ts";

const app = fastify();

app.addHook("onRequest", async (req) => {
	logToFile(`Incoming request: ${req.method} ${req.url}`, {
		method: req.method,
		url: req.url,
		query: req.query,
	});
});

app.addHook("onResponse", async (req, reply) => {
	logToFile(`Response sent: ${req.method} ${req.url}`, {
		method: req.method,
		url: req.url,
		statusCode: reply.statusCode,
		responseTime: reply.elapsedTime,
	});
});

app.get("/", async (_, reply) => {
	reply.status(200).send({ ok: true });
});

app.setNotFoundHandler((_req, reply) => {
	reply.status(404).send({ error: "Route not found" });
});

app.setErrorHandler(errorHandler);

app.decorateRequest("tenant", null);

app.register(tenantRoutes);
app.register(conversationRoutes);
app.register(toolRoutes);
app.register(wahaWebHook);

app
	.listen({
		port: env.PORT,
	})
	.then((_) => {
		console.log("HTTP SERVER RUNNING on 3333");
	});
