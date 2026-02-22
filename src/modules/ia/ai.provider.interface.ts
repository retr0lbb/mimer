export interface AIProvider{
    chat(input: {
        message: string,
        tenantId: string
    }): Promise<string>
}