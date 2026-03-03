import type { FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { AppError } from "./appError.ts";

export function errorHandler(
	error: unknown,
	_request: FastifyRequest,
	reply: FastifyReply,
) {
	if (error instanceof ZodError) {
		return reply.status(400).send({
			error: "Validation error",
			issues: error.issues,
		});
	}

	if (error instanceof AppError) {
		return reply.status(error.statusCode).send({ error: error.message });
	}

	console.error(error);
	return reply.status(500).send({ error: "Internal Server Error" });
}
