import z from "zod/v4"


const ENV_SCHEMA = z.object({
    PORT: z.number().int().positive()
})

export const env = ENV_SCHEMA.parse(process.env)