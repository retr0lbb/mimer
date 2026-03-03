import { AppError } from "./appError.ts";

export class NotFoundError extends AppError {
	constructor(message = "Resource not found") {
		super(message, 404);
	}
}
