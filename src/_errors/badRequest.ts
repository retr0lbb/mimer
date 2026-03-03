import { AppError } from "./appError.ts";

export class BadRequestError extends AppError {
	constructor(message = "Bad request") {
		super(message, 400);
	}
}
