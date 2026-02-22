import { AIProvider } from "../ai.provider.interface.ts";
import { GoogleGenerativeAI } from "@google/generative-ai"

export class GeminiProvider implements AIProvider{
    private client: GoogleGenerativeAI;

    constructor(googleApiKey: string){
        this.client = new GoogleGenerativeAI(googleApiKey)
    }
    async chat(input: { message: string; tenantId: string; }): Promise<string> {
        const model = this.client.getGenerativeModel({
            model: "gemini-2.5-flash"
        })

        const result = await model.generateContent({
            contents: [{
                role: "user",
                parts: [
                    {
                        text: `Voce eh uma IA para o tenant picbrandLTA. reponda: ${input.message}`
                    }
                ]
            }]
        })

        return result.response.text()
        
    }
}