import "fastify";
import type { Tenant } from "./tenant.ts"; // ajusta o path

declare module "fastify" {
	interface FastifyRequest {
		tenant: Tenant;
	}
}
