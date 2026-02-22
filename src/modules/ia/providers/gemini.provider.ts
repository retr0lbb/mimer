import { AIProvider } from "../ai.provider.interface.ts";
import { GoogleGenerativeAI } from "@google/generative-ai";

export class GeminiProvider implements AIProvider {
  private client: GoogleGenerativeAI;

  constructor(googleApiKey: string) {
    this.client = new GoogleGenerativeAI(googleApiKey);
  }

  async chat(input: { message: string; tenantId: string }): Promise<string> {
    const model = this.client.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Você é uma IA para o tenant PICBRANDLTA. Responda: ${input.message}`,
            },
          ],
        },
      ],
    });

    return result.response.text();
  }

  async stream(input: {
    message: string;
    tenantId: string;
    onChunk: (chunk: string) => void;
  }) {
    const model = this.client.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
    });

    const result = await model.generateContentStream({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Você é uma IA para o tenant PICBRANDLTA. Responda: ${input.message}`,
            },
          ],
        },
      ],
    });

    let accumulated = "";

    for await (const chunk of result.stream) {
        const text = chunk.text();
        if (text) {
            accumulated += text;
            input.onChunk(text);
        }
    }
  }
}

