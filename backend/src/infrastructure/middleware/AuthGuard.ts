import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../../shared/utils/ApiError";

const jwtSecret = process.env.JWT_SECRET || "";

if (!jwtSecret) {
    throw new Error("JWT_SECRET is not defined. Configure it in the environment.");
}

export default function authGuard(request: Request, response: Response, next: NextFunction): void {
    const authHeader = request.headers.authorization;

    if (!authHeader) {
        throw new UnauthorizedError("Authentication is required to access this endpoint.");
    }

    const token = extractToken(authHeader);
    const user = verifyToken(token);

    request.userId = user.id;
    next();
}

function extractToken(authHeader: string): string {
    return authHeader.replace("Bearer ", "").trim();
}

function verifyToken(token: string): any {
    const decoded = jwt.verify(token, jwtSecret);

    if (!decoded) {
        throw new UnauthorizedError("Invalid or expired token.");
    }

    return decoded;
}
