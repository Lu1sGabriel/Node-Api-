import Prisma from "../orms/Prisma";
import { CreateUserDTO, UpdateUserDTO } from "../dtos/UserDTO";

export default class UserRepository {

    async findById(id: string): Promise<any> {
        return await Prisma.users.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
    }

    async findByEmail(email: string): Promise<any> {
        return await Prisma.users.findFirst({
            where: {
                email,
                deletedAt: null,
            },
        });
    }

    async create(data: CreateUserDTO) {
        return await Prisma.users.create({
            data,
        });
    }

    async update(id: string, data: UpdateUserDTO) {
        return await Prisma.users.update({
            where: { id },
            data,
        });
    }

    async findByCpf(cpf: string) {
        return await Prisma.users.findFirst({
            where: { cpf },
        });
    }

    async delete(id: string): Promise<any> {
        return await Prisma.users.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

}