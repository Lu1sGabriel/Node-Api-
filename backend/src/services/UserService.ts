import UserRepository from "../repositories/UserRepository";
import AppError from "../handlers/AppError";
import { CreateUserDTO, UpdateUserDTO } from "../dtos/UserDTO";
import { PasswordService } from "./PasswordService ";

interface IUserService {
    create(dto: CreateUserDTO): Promise<any>;
    update(id: string, dto: UpdateUserDTO): Promise<any>;
    findById(id: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
}

export class UserService implements IUserService {

    private readonly userRepository: UserRepository;
    private readonly passwordService: PasswordService;

    public constructor(userRepository: UserRepository = new UserRepository(), passwordService: PasswordService = new PasswordService()) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }

    public async create(dto: CreateUserDTO): Promise<any> {
        await this.validateUniqueFields(dto.email, dto.cpf);

        const hashedPassword = await this.passwordService.hashPassword(dto.password);
        const userData = this.buildUserData(dto, hashedPassword);

        return this.userRepository.create(userData);
    }

    public async update(id: string, dto: UpdateUserDTO): Promise<any> {
        const user = await this.findUser(id);

        if (dto.email) {
            await this.validateUniqueEmail(dto.email);
            user.email = dto.email;
        }

        if (dto.password) {
            user.password = await this.passwordService.hashPassword(dto.password);
        }

        if (dto.name) {
            user.name = dto.name;
        }

        if (dto.avatar) {
            user.avatar = dto.avatar;
        }

        return this.userRepository.update(id, user);
    }

    public async findById(id: string): Promise<any> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError("Usuário não encontrado", 404);
        }
        return user;
    }

    public async findByEmail(email: string): Promise<any> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new AppError("Usuário não encontrado", 404);
        }
        return user;
    }

    public async delete(id: string): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError("Usuário não encontrado", 404);
        }
        await this.userRepository.delete(id);
    }

    private async validateUniqueFields(email: string, cpf: string): Promise<void> {
        const emailExists = await this.userRepository.findByEmail(email);
        const cpfExists = await this.userRepository.findByCpf(cpf);

        if (emailExists || cpfExists) {
            throw new AppError("E-mail ou CPF já está em uso", 400);
        }
    }

    private async validateUniqueEmail(email: string): Promise<void> {
        const emailExists = await this.userRepository.findByEmail(email);
        if (emailExists) {
            throw new AppError("E-mail já está em uso", 400);
        }
    }

    private async findUser(id: string): Promise<any> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new AppError("Usuário não encontrado", 404);
        }
        return user;
    }

    private buildUserData(dto: CreateUserDTO, hashedPassword: string): any {
        return {
            name: dto.name,
            email: dto.email,
            cpf: dto.cpf,
            password: hashedPassword,
            avatar: dto.avatar || "default-avatar.png",
            xp: 0,
            level: 1,
        };
    }

}