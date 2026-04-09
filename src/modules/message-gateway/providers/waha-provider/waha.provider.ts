import type { MessageProvider } from "../../types.ts";

export class WaHaProvider implements MessageProvider {
	constructor(private readonly baseUrl: string) {}

	async sendMessage(input: {
		chatId: string;
		tenantId: string;
		userIdentifier: string;
		text: string;
	}): Promise<void> {
		const url = new URL(`${this.baseUrl}/api/sendText`);

		const body = {
			chatId: input.chatId,
			reply_to: input.userIdentifier,
			text: input.text,
			linkPreview: true,
			linkPreviewHighQuality: false,
			session: "default", // change later for better multissessão
		};
		await fetch(url, {
			method: "post",
			body: JSON.stringify(body),
		});
	}
}
