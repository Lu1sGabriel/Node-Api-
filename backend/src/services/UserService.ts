import UserRepository from "../repositories/UserRepository";
import { UserCreateDTO, UserUpdateDTO } from "../dtos/UserDTO";
import { PasswordService } from "./PasswordService ";
import { BadRequestError, NotFoundError } from "../helpers/ApiErrors";

interface IUserService {
    create(dto: UserCreateDTO): Promise<any>;
    update(id: string, dto: UserUpdateDTO): Promise<any>;
    findById(id: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    delete(id: string): Promise<void>;
}

export default class UserService implements IUserService {
    private readonly userRepository: UserRepository;
    private readonly passwordService: PasswordService;

    public constructor(
        userRepository: UserRepository = new UserRepository(),
        passwordService: PasswordService = new PasswordService()
    ) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }

    public async create(dto: UserCreateDTO): Promise<any> {
        await this.validateUniqueFields(dto.email, dto.cpf);

        const hashedPassword = await this.passwordService.hashPassword(dto.password);
        const userData = this.buildUserData(dto, hashedPassword);

        return this.userRepository.create(userData);
    }

    public async update(id: string, dto: UserUpdateDTO): Promise<any> {
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
            throw new NotFoundError("User not found.");
        }
        return user;
    }

    public async findByEmail(email: string): Promise<any> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundError("User not found.");
        }
        return user;
    }

    public async delete(id: string): Promise<void> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundError("User not found.");
        }
        await this.userRepository.delete(id);
    }

    private async validateUniqueFields(email: string, cpf: string): Promise<void> {
        const emailExists = await this.userRepository.findByEmail(email);
        const cpfExists = await this.userRepository.findByCpf(cpf);

        if (emailExists || cpfExists) {
            throw new BadRequestError("E-mail or CPF already in use.");
        }
    }

    private async validateUniqueEmail(email: string): Promise<void> {
        const emailExists = await this.userRepository.findByEmail(email);
        if (emailExists) {
            throw new BadRequestError("E-mail already in use.");
        }
    }

    private async findUser(id: string): Promise<any> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundError("User not found.");
        }
        return user;
    }

    private buildUserData(dto: UserCreateDTO, hashedPassword: string): any {
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