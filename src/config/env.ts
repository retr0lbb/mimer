import z from "zod/v4"


const ENV_SCHEMA = z.object({
    PORT: z.coerce.number().int().positive(),
    DATABASE_URL: z.url(),
    OPENAI_API_KEY: z.string().nonempty(),
    IA_PROVIDER: z.union([z.literal("gemini"), z.literal("openia")]),
    GEMINI_API_KEY: z.string().nonempty()
})

export const env = ENV_SCHEMA.parse(process.env)