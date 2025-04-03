import jwt from "jsonwebtoken";
import UserService from "../../../application/service/user/UserService";
import { PasswordService } from "../password/PasswordService ";
import { UnauthorizedError, NotFoundError } from "../../../shared/utils/ApiError";
import { UserCreateDTO } from "../../../presentation/dto/user/UserDTO";
import { AuhtLoginDTO } from "../../../presentation/dto/auth/AuthLoginDTO";

export default class AuthService {

    private userService: UserService;
    private passwordService: PasswordService;
    private jwtSecret: string;

    constructor() {
        this.userService = new UserService();
        this.passwordService = new PasswordService();
        this.jwtSecret = process.env.JWT_SECRET || "";

        if (!this.jwtSecret) {
            throw new Error("JWT_SECRET is not defined. Configure it in the environment.");
        }
    }

    generateToken(payload: object): string {
        return jwt.sign(payload, this.jwtSecret, { expiresIn: "1d" });
    }

    async register(dto: UserCreateDTO): Promise<any> {
        const user = await this.userService.create(dto);
        return user;
    }

    async login(dto: AuhtLoginDTO): Promise<{ token: string }> {
        const user = await this.userService.findByEmail(dto.email);

        await this.passwordService.verifyPassword(user.password, dto.password);

        const token = this.generateToken({ id: user.id, email: user.email });

        return { token };
    }

}