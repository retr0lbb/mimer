import fastify from "fastify";
import { db } from "./db/index.ts";

const app = fastify()

app.get("/", async(request, reply) => {
    reply.status(200).send({ok: true})
})

app.listen({
    port: 3333,
}).then( _ => {
    console.log(`HTTP server running on port ${3333}`)
})