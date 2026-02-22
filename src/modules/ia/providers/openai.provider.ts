import {AIProvider} from "../ai.provider.interface.ts"
import OpenAI from "openai"

export class OpenAIProvider implements AIProvider{
    private client: OpenAI;

    constructor(openIaKey: string){
        this.client = new OpenAI({apiKey: openIaKey})
    }

    async chat(input: { message: string; tenantId: string; }): Promise<string> {
        const response = await this.client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are an AI assistant for tenant picbrandLTA"
                },
                {
                    role: "user",
                    content: input.message
                }
            ]
        })


        return response.choices[0].message.content ?? ''
    }
}