import prisma from "../orm/Prisma";
import { CreateUserDTO, UpdateUserDTO } from "../dtos/UserDTO";

export class UserRepository {

    async findByEmail(email: string) {
        return await prisma.users.findUnique({
            where: { email },
        });
    }

    async findById(id: string) {
        return await prisma.users.findUnique({
            where: { id },
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

}