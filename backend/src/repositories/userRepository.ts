import Prisma from "../orms/Prisma";
import { UserCreateDTO, UserUpdateDTO } from "../dtos/UserDTO";

export default class UserRepository {

    public async findById(id: string): Promise<any> {
        return await Prisma.users.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
    }

    public async findByEmail(email: string): Promise<any> {
        return await Prisma.users.findFirst({
            where: {
                email,
                deletedAt: null,
            },
        });
    }

    public async create(data: UserCreateDTO) {
        return await Prisma.users.create({
            data,
        });
    }

    public async update(id: string, data: UserUpdateDTO) {
        return await Prisma.users.update({
            where: { id },
            data,
        });
    }

    public async findByCpf(cpf: string) {
        return await Prisma.users.findFirst({
            where: { cpf },
        });
    }

    public async delete(id: string): Promise<any> {
        return await Prisma.users.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

}