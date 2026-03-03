import type { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { AppError } from "./appError.ts";
import { logger } from "../utils/logger.ts";

export function errorHandler(
	error: unknown,
	_request: FastifyRequest,
	reply: FastifyReply,
) {
	if (error instanceof ZodError) {
		logger.debug({ err: error }, "Validation error");
		return reply.status(400).send({
			error: "Validation error",
			issues: error.issues,
		});
	}

	if (error instanceof AppError) {
		logger.info({ err: error }, "App error");
		return reply.status(error.statusCode).send({ error: error.message });
	}

	logger.error({ err: error }, "Unhandled error");
	return reply.status(500).send({ error: "Internal Server Error" });
}
