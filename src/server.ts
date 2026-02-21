import fastify from "fastify";
import {tenantRoutes} from "./modules/tenant/tenant.route.ts"

const app = fastify()

app.get("/", async(request, reply) => {
    reply.status(200).send({ok: true})
})

app.register(tenantRoutes)

app.listen({
    port: 3333,
}).then( _ => {
    console.log(`HTTP server running on port ${3333}`)
})