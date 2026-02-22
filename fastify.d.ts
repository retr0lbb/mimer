import "fastify"

declare module "fastify" {
  interface FastifyRequest {
    tenant: typeof tenants.$inferSelect
  }
}