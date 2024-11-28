
import CustomError from "./CustomError.js";

export class BadRequestError extends CustomError {
    constructor(message) {
        super(message);
        this.statusCode=400;
    }
}