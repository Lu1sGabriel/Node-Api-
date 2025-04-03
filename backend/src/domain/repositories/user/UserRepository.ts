import Prisma from "../../../infrastructure/orm/Prisma";

export default class UserRepository {
    public async findById(id: string): Promise<any | null> {
        const user = await Prisma.users.findUnique({
            where: { id, deletedAt: null },
            include: {
                userAchievements: {
                    include: { achievement: true },
                },
            },
        });

        if (!user) return null;

        return this.mapUserData(user);
    }

    public async findByEmail(email: string): Promise<any | null> {
        return Prisma.users.findUnique({ where: { email } });
    }

    public async findByCpf(cpf: string): Promise<boolean> {
        return !!(await Prisma.users.findUnique({ where: { cpf } }));
    }

    public async create(data: { name: string; email: string; cpf: string; password: string; avatar?: string }): Promise<any> {
        return Prisma.users.create({ data });
    }

    public async update(id: string, data: Partial<{ name: string; email: string; password: string; avatar: string; xp: number; level: number }>): Promise<any> {
        return Prisma.users.update({ where: { id }, data });
    }

    public async delete(id: string): Promise<void> {
        await Prisma.users.update({ where: { id }, data: { deletedAt: new Date() } });
    }

    private mapUserData(user: any) {
        return {
            id: user.id,
            name: user.name,
            email: user.email,
            cpf: user.cpf,
            avatar: user.avatar,
            xp: user.xp,
            level: user.level,
            deletedAt: user.deletedAt,
            achievements: user.userAchievements.map(({ achievement }: { achievement: { name: string; criterion: string } }) => ({
                name: achievement.name,
                criterion: achievement.criterion,
            })),
        };
    }

}
