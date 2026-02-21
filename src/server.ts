import fastify from "fastify";

const app = fastify()

app.listen({
    port: 3333,
}).then( _ => {
    console.log(`HTTP server running on port ${3333}`)
})