import type { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { AppError } from "./appError.ts";
import { logToFile } from "../utils/logger.ts";

export function errorHandler(
	error: unknown,
	_request: FastifyRequest,
	reply: FastifyReply,
) {
	if (error instanceof ZodError) {
		logToFile(`Validation error: ${error.message}`, { err: error });
		return reply.status(400).send({
			error: "Validation error",
			issues: error.issues,
		});
	}

	if (error instanceof AppError) {
		logToFile(`App error: ${error.message}`, {
			err: error,
			statusCode: error.statusCode,
		});
		return reply.status(error.statusCode).send({ error: error.message });
	}

	logToFile(
		`Unhandled error: ${error instanceof Error ? error.message : "Unknown error"}`,
		{
			err: error,
			stack: error instanceof Error ? error.stack : undefined,
		},
	);
	return reply.status(500).send({ error: "Internal Server Error" });
}
