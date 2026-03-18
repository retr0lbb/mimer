import { logToFile } from "./logger.ts";

export function logDbInsert(table: string, data: unknown) {
	logToFile(`Database insert on ${table}`, {
		table,
		operation: "INSERT",
		data,
	});
}

export function logDbUpdate(table: string, where: unknown, data: unknown) {
	logToFile(`Database update on ${table}`, {
		table,
		operation: "UPDATE",
		where,
		data,
	});
}

export function logDbDelete(table: string, where: unknown) {
	logToFile(`Database delete on ${table}`, {
		table,
		operation: "DELETE",
		where,
	});
}

export function logDbSelect(table: string, resultCount: number) {
	logToFile(`Database select on ${table}`, {
		table,
		operation: "SELECT",
		count: resultCount,
	});
}
