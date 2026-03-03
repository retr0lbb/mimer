import { z } from "zod";

export const ChatRequestDTO = z.object({
    message: z.string().min(1),
});

export type ChatRequestDTO = z.infer<typeof ChatRequestDTO>;
