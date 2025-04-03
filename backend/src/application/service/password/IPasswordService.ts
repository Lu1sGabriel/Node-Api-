export interface IPasswordService {
    hashPassword(password: string): Promise<string>;
    verifyPassword(hash: string, password: string): Promise<void>;
}