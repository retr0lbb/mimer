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
  tenantId: string
  providerName: string
  messages: AIMessage[]
  tools?: AITool[]
  onChunk: (chunk: string) => void
}) {
  const provider = this.providerFactory.create(input.providerName)

  if (!provider.generateStream) {
    throw new Error("Stream not supported by provider")
  }

  const context = [...input.messages]

  if (input.tools && input.tools.length > 0) {
    const result = await this.run({
      tenantId: input.tenantId,
      providerName: input.providerName,
      messages: context,
      tools: input.tools
    })

    if (result.type === "final" && result.content) {
      input.onChunk(result.content)
    }

    return result
  }

  const response = await provider.generateStream({
    messages: context,
    tools: input.tools,
    onChunk: (chunk) => {
      input.onChunk(chunk)
    }
  })

  return {
    type: "final",
    content: response.text
  }
}
}