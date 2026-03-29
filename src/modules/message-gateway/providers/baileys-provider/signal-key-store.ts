import type {
	SignalDataSet,
	SignalDataTypeMap,
	SignalKeyStore,
} from "baileys";

type KeyMap = Record<string, Record<string, unknown>>;

export class DatabaseSignalKeyStore implements SignalKeyStore {
	private readonly keys: KeyMap;
	public onKeysUpdated: () => Promise<void> = async () => {};

	constructor(initialKeys: KeyMap) {
		this.keys = { ...initialKeys };
	}

	get<T extends keyof SignalDataTypeMap>(
		type: T,
		ids: string[],
	): { [id: string]: SignalDataTypeMap[T] } {
		const categoryData = this.keys[type] ?? {};

		return ids.reduce(
			(result, id) => {
				const value = categoryData[id];
				if (value !== undefined) {
					result[id] = value as SignalDataTypeMap[T];
				}
				return result;
			},
			{} as { [id: string]: SignalDataTypeMap[T] },
		);
	}

	async set(data: SignalDataSet): Promise<void> {
		for (const category in data) {
			this.keys[category] = {
				...(this.keys[category] ?? {}),
				...data[category as keyof SignalDataSet],
			};
		}

		await this.onKeysUpdated();
	}

	toJSON(): KeyMap {
		return { ...this.keys };
	}
}
