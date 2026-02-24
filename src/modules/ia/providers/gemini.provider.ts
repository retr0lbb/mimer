import { AIMessage, AITool, AIProviderResponse } from "../ai.types.ts";
import { AIProvider } from "./ai.provider.interface.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;

  constructor(googleApiKey: string) {
    this.client = new GoogleGenerativeAI(googleApiKey);
  }

  async generate(input: { messages: AIMessage[]; tools?: AITool[]; stream?: boolean; }): Promise<AIProviderResponse> {
    

    return {
      finishReason: "tool_call",
      text: "Ola eu sou uma interpretação de IA de GEMINI AI"
    } as AIProviderResponse
  }
}

