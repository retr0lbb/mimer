import { transport, pino } from "pino";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { mkdirSync } from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isDev = process.env.NODE_ENV !== "production";

const logsDir = join(__dirname, "../../logs");
mkdirSync(logsDir, { recursive: true });

const fileTransport = transport({
	target: "pino-roll",
	options: {
		file: join(logsDir, "app"),
		frequency: "daily",
		mkdir: true,
		maxFiles: 30,
	},
});

export const fileLogger = pino({ level: "info" }, fileTransport);

export const consoleFileLogger = pino(
	{
		level: "info",
	},
	transport({
		target: "pino-pretty",
		options: {
			colorize: true,
			translateTime: "yyyy-mm-dd HH:MM:ss",
			ignore: "pid,hostname",
		},
	}),
);

export function logToFile(message: string, meta?: unknown) {
	fileLogger.info(meta ?? {}, message);
	consoleFileLogger.info(meta ?? {}, message);
}
