import {AIMessage, AIProviderResponse, AITool} from "../ai.types.ts"

export interface AIProvider{
    generate(input: {
        messages: AIMessage[],
        tools?: AITool[],
        stream?: boolean
    }): Promise<AIProviderResponse>
}