import {OpenAIProvider} from "./providers/openai.provider.ts"
import {AIProvider} from "./ai.provider.interface.ts"
import { env } from "../../config/env.ts"
import { GeminiProvider } from "./providers/gemini.provider.ts"

export function aiProviderFactory(): AIProvider{
    const provider = env.IA_PROVIDER

    switch(provider){
        case "gemini":
            if(!env.GEMINI_API_KEY){
                throw new Error("API key not found")
            }
            return new GeminiProvider(env.GEMINI_API_KEY)
        case "openia":
            if(!env.OPENAI_API_KEY){
                throw new Error("API key not found")
            }
            return new OpenAIProvider(env.OPENAI_API_KEY)
    }
}