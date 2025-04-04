import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../shared/utils/ApiError";


export default function middlewareError(error: Error & Partial<ApiError>, request: Request, response: Response, next: NextFunction) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Unexpected error occurred. ";

    response.status(statusCode).json({
        message
    });

}