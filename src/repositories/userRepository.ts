import prisma from "../orm/prisma";
import { CreateUserDTO, UpdateUserDTO } from "../dtos/UserDTO";

export default class UserRepository {

    async findById(id: string): Promise<any> {
        return await prisma.users.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
    }

    async findByEmail(email: string): Promise<any> {
        return await prisma.users.findFirst({
            where: {
                email,
                deletedAt: null,
            },
        });
    }

    async create(data: CreateUserDTO) {
        return await prisma.users.create({
            data,
        });
    }

    async update(id: string, data: UpdateUserDTO) {
        return await prisma.users.update({
            where: { id },
            data,
        });
    }

    async findByCpf(cpf: string) {
        return await prisma.users.findFirst({
            where: { cpf },
        });
    }

    async delete(id: string): Promise<any> {
        return await prisma.users.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

}