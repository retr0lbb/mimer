import z from "zod/v4"


const ENV_SCHEMA = z.object({
    PORT: z.coerce.number().int().positive(),
    DATABASE_URL: z.url()
})

export const env = ENV_SCHEMA.parse(process.env)