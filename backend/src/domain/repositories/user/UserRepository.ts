import Prisma from "../../../infrastructure/orm/Prisma";

export default class UserRepository {

    public async findById(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        cpf: string;
        avatar?: string;
        xp?: number;
        level?: number;
        deletedAt: Date | null;
        achievements: {
            name: string;
            criterion: string;
        }[];
    } | null> {
        const user = await Prisma.users.findUnique({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                userAchievements: {
                    include: {
                        achievement: true,
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
            deletedAt: user.deletedAt,
            achievements: user.userAchievements.map(userAchievement => ({
                name: userAchievement.achievement.name,
                criterion: userAchievement.achievement.criterion,
            })),
        };
    }

    public async findByEmail(email: string): Promise<boolean> {
        const user = await Prisma.users.findUnique({
            where: {
                email,
                deletedAt: null,
            },
        });

        return !!user;
    }

    public async findByCpf(cpf: string): Promise<boolean> {
        const user = await Prisma.users.findUnique({
            where: {
                cpf,
                deletedAt: null,
            },
        });

        return !!user;
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
            xp?: number;
            level?: number;
        }
    ): Promise<{
        id: string;
        name: string;
        email: string;
        cpf: string;
        password: string;
        avatar?: string;
        xp?: number;
        level?: number;
    }> {
        return Prisma.users.update({
            where: { id },
            data,
        });
    }

    public async delete(id: string): Promise<void> {
        await Prisma.users.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

}