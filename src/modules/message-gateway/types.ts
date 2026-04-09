export interface MessageProvider {
	sendMessage(input: {
		tenantId: string;
		userIdentifier: string;
		text: string;
	}): Promise<void>;
}
