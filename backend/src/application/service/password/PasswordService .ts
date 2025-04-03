import argon2 from "argon2";
import { UnauthorizedError } from "../../../shared/utils/ApiError";
import { IPasswordService } from "./IPasswordService";

export class PasswordService implements IPasswordService {

    public async hashPassword(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    public async verifyPassword(hash: string, password: string): Promise<void> {
        const isMatch = await argon2.verify(hash, password);

        if (!isMatch) {
            throw new UnauthorizedError("Incorrect password.");
        }
    }

}