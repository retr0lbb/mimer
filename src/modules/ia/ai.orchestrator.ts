import { AIMessage, AITool } from "./ai.types.ts";
import {ProviderFactory} from "./providers/ai.provider.factory.ts"

export class AIOrchestrator{
    constructor(private providerFactory: ProviderFactory){

    }

    async run(input: {
        tenantId: string,
        messages: AIMessage[],
        tools?: AITool[],
        providerName: string
    }){
        const provider = this.providerFactory.create(input.providerName)

        const context = [...input.messages]

        let iterations = 0

        while (iterations < 5){
            const response = await provider.generate({
                messages: context,
                tools: input.tools
            })

            if(response.toolCall){
                //TODO implement TOOL EXECUTOR

                iterations++
                continue
            }


            return {
                type: "final",
                content: response.text
            }
        }

        throw new Error("Too Many Interations")
    }

    async runStream(input: {
        tenantId: string,
        providerName: string,
        messages: AIMessage[],
        tools?: AITool[]
        onChunk: (chunk: any) => void
    }){
        throw new Error("Not Implemented Yet")
    }
}