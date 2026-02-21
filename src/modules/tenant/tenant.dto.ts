import {z} from "zod/v4"

export const CreateTenantDTO = z.object({
    name: z.string().min(2).max(258),
    slug: z.string().min(2).max(258).slugify(),

})
export type CreateTenantDTO = z.infer<typeof CreateTenantDTO> & {
    apiKey: string,
    
} 