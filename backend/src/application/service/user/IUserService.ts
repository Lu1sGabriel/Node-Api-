import { UserCreateDTO, UserUpdateDTO } from "../../../presentation/dto/user/UserDTO";

export default interface IUserService {
    create(dto: UserCreateDTO): Promise<any>;
    update(id: string, dto: UserUpdateDTO): Promise<any>;
    findById(id: string): Promise<any>;
    delete(id: string): Promise<void>;
}