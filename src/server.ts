import fastify from "fastify";
import { tenantRoutes } from "./modules/tenant/tenant.route.ts";
import { aiRoutes } from "./modules/ia/ia.route.ts";
import { errorHandler } from "./_errors/handlers.ts";

const app = fastify();

app.get("/", async (_, reply) => {
	reply.status(200).send({ ok: true });
});

app.setNotFoundHandler((_req, reply) => {
	reply.status(404).send({ error: "Route not found" });
});

app.setErrorHandler(errorHandler);

app.register(tenantRoutes);
app.register(aiRoutes);

app
	.listen({
		port: 3333,
	})
	.then((_) => {
		console.log(`HTTP server running on port ${3333}`);
	});
