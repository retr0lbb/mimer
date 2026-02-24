import { AIMessage, AITool, AIProviderResponse } from "../ai.types.ts";
import {AIProvider} from "./ai.provider.interface.ts"
import OpenAI from "openai"

export class OpenAIProvider implements AIProvider{
    private client: OpenAI;

    constructor(openIaKey: string){
        this.client = new OpenAI({apiKey: openIaKey})
    }

    async generate(input: { messages: AIMessage[]; tools?: AITool[]; stream?: boolean; }): Promise<AIProviderResponse> {
        return {finishReason: "stop", text: "Ola eu sou uma interpretação de OPENAI CHATGPT"}
    }
}