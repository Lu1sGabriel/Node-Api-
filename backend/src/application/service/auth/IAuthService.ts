import { AuhtLoginDTO } from "../../../presentation/dto/auth/AuthLoginDTO";
import { UserCreateDTO } from "../../../presentation/dto/user/UserDTO";

export default interface IAuthService {
    generateToken(payload: object): string;
    login(dto: AuhtLoginDTO): Promise<{ token: string }>;
    register(dto: UserCreateDTO): Promise<any>;
}