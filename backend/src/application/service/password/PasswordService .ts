import argon2 from "argon2";
import { IPasswordService } from "./IPasswordService";

export class PasswordService implements IPasswordService {

    public async hashPassword(password: string): Promise<string> {
        return await argon2.hash(password);
    }

    public async verifyPassword(hash: string, password: string): Promise<boolean> {
        return await argon2.verify(hash, password);
    }

}