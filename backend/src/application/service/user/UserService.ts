import UserRepository from "../../../domain/repositories/user/UserRepository";
import { UserCreateDTO, UserUpdateDTO } from "../../../presentation/dto/user/UserDTO";
import { PasswordService } from "../password/PasswordService ";
import { BadRequestError, NotFoundError } from "../../../shared/utils/ApiError";
import IUserService from "./IUserService";
import Validators from "../../../shared/utils/Validators";

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
        await this.validateFields(dto, false);

        await this.validateUniqueFields(dto.email, dto.cpf);

        const hashedPassword = await this.passwordService.hashPassword(dto.password);
        const userData = {
            name: dto.name,
            email: dto.email,
            cpf: dto.cpf,
            password: hashedPassword,
            avatar: dto.avatar
        }

        return this.userRepository.create(userData);
    }

    public async update(id: string, dto: UserUpdateDTO): Promise<any> {
        await this.validateFields(dto, true);

        const user = await this.findUserById(id);

        let hashedPassword = user.password;
        if (dto.password) {
            hashedPassword = await this.passwordService.hashPassword(dto.password);
        }

        const updatedUser = {
            name: dto.name ?? user.name,
            email: dto.email ?? user.email,
            password: hashedPassword,
            avatar: dto.avatar ?? user.avatar,
        };

        return this.userRepository.update(id, updatedUser);
    }

    public async findById(id: string): Promise<any> {
        return this.findUserById(id);
    }

    public async findByEmail(email: string): Promise<any> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundError("User not found. ");
        }

        if (user.deletedAt) {
            throw new BadRequestError("This user is disabled. Please contact support for assistance.");
        }

        return user;
    }

    public async delete(id: string): Promise<void> {
        await this.findUserById(id);
        await this.userRepository.delete(id);
    }

    private async validateFields(dto: UserCreateDTO | Partial<UserUpdateDTO>, isUpdate: boolean): Promise<void> {
        if (dto.name && !Validators.validatePersonalName(dto.name)) {
            throw new BadRequestError("Invalid name.");
        }

        if (!isUpdate && "cpf" in dto && dto.cpf && !Validators.validateCpf(dto.cpf)) {
            throw new BadRequestError("Invalid CPF.");
        }

        if (dto.email && !Validators.validateEmailAddress(dto.email)) {
            throw new BadRequestError("Invalid email.");
        }

        if (dto.password && !Validators.validatePassword(dto.password)) {
            throw new BadRequestError(
                "Invalid password. It must have at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character."
            );
        }
    }

    private async validateUniqueFields(email: string, cpf?: string): Promise<void> {
        const [emailUser, cpfUser] = await Promise.all([
            this.userRepository.findByEmail(email),
            cpf ? this.userRepository.findByCpf(cpf) : null,
        ]);

        if (emailUser || cpfUser) {
            throw new BadRequestError("E-mail or CPF already in use.");
        }
    }

    private async findUserById(id: string): Promise<any> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new NotFoundError("User not found.");
        }

        if (user.deletedAt) {
            throw new BadRequestError("This user is disabled. Please contact support for assistance.");
        }

        return user;
    }

}
