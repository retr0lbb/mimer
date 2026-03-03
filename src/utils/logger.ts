import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

export const logger = pino({
	level: process.env.LOG_LEVEL || (isDev ? "debug" : "info"),
	transport: isDev
		? {
				target: "pino-pretty",
				options: { colorize: true, translateTime: "yyyy-mm-dd HH:MM:ss" },
			}
		: undefined,
});
//fix this latter

export default logger;
