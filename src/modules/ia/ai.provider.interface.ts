export interface AIProvider{
    chat(input: {
        message: string,
        tenantId: string
    }): Promise<string>

    stream?: (input: {
        message: string,
        tenantId: string,
        onChunk: (chunk: string) => void
    }) => Promise<void>
}