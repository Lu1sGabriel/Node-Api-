import Prisma from "../orms/Prisma";

export default class UserRepository {

    public async findById(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        cpf: string;
        avatar?: string;
        xp?: number;
        level?: number;
        preferences: {
            name: string;
            description: string;
        }[];
    } | null> {
        const user = await Prisma.users.findUnique({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                preferences: {
                    include: {
                        type: true,
                    },
                },
            },
        });

        if (!user) return null;

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            avatar: user.avatar,
            xp: user.xp,
            level: user.level,
            preferences: user.preferences.map(preference => ({
                name: preference.type.name,
                description: preference.type.description,
            })),
        };
    }

    public async findByEmail(email: string): Promise<{
        id: string;
        name: string;
        email: string;
        cpf: string;
        avatar?: string;
        xp?: number;
        level?: number;
        preferences?: { name: string; description: string }[];
    } | null> {
        return Prisma.users.findUnique({
            where: {
                email,
                deletedAt: null,
            },
        });
    }

    public async create(data: {
        name: string;
        email: string;
        cpf: string;
        password: string;
        avatar?: string;
    }): Promise<{
        id: string;
        name: string;
        email: string;
        cpf: string;
        password: string;
        avatar?: string;
    }> {
        return Prisma.users.create({ data });
    }

    public async update(
        id: string,
        data: {
            name?: string;
            email?: string;
            password?: string;
            avatar?: string;
        }
    ): Promise<{
        id: string;
        name: string;
        email: string;
        cpf: string;
        password: string;
        avatar?: string;
    }> {
        return Prisma.users.update({
            where: { id },
            data,
        });
    }

    public async findByCpf(cpf: string): Promise<{
        id: string;
        name: string;
        email: string;
        cpf: string;
        avatar?: string;
        xp?: number;
        level?: number;
    } | null> {
        return Prisma.users.findUnique({
            where: { cpf },
        });
    }

    public async delete(id: string): Promise<void> {
        await Prisma.users.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

}