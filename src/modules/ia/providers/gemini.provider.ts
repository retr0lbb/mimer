import { randomUUID } from "node:crypto";
import { AIMessage, AITool, AIProviderResponse } from "../ai.types.ts";
import { AIProvider } from "./ai.provider.interface.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;

  constructor(googleApiKey: string) {
    this.client = new GoogleGenerativeAI(googleApiKey);
  }

  private mapMessages(messages: AIMessage[]){
    return messages.map((m) => ({
      role: m.role === "assistant" ? "model" : m.role,
      parts: [{text: m.content}]
    }))
  }

  private mapTools(tools?: AITool[]){
    if(!tools || tools.length === 0) return undefined

    return tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: tool.schema
    }))
  }

  async generate(input: { messages: AIMessage[]; tools?: AITool[]; stream?: boolean; }): Promise<AIProviderResponse> {
    const model = this.client.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      tools: input.tools 
        ? [{functionDeclarations: this.mapTools(input.tools)}]
        : undefined
    })

    const result = await model.generateContent({
      contents: this.mapMessages(input.messages)
    })

    const response = result.response
    const candidate = response.candidates?.[0]

    if(!candidate){
      throw new Error("No response from gemini")
    }

    const parts = candidate.content.parts?.[0]

    if(parts?.functionCall){
      return {
        finishReason: "tool_call",
        toolCall: {
          id: randomUUID(),
          name: parts.functionCall.name,
          arguments: parts.functionCall.args
        }
      }
    }

    return {
      finishReason: "stop",
      text: response.text()
    } as AIProviderResponse
  }
}

