import Prisma from "../../../infrastructure/orm/Prisma";

export default class AchievementsRepository {

    public async findAll(): Promise<{
        id: string;
        name: string;
        criterion: string;
    }[]> {
        const achievements = await Prisma.achievements.findMany({
            orderBy: {
                name: "asc",
            },
        });

        return achievements.map(achievement => ({
            id: achievement.id,
            name: achievement.name,
            criterion: achievement.criterion,
        }));
    }

    public async findById(id: string): Promise<{
        id: string;
        name: string;
        criterion: string;
    } | null> {
        const achievement = await Prisma.achievements.findUnique({
            where: {
                id,
            },
        });

        if (!achievement) return null;

        return {
            id: achievement.id,
            name: achievement.name,
            criterion: achievement.criterion,
        };
    }

    public async create(data: {
        name: string;
        criterion: string;
    }): Promise<{
        id: string;
        name: string;
        criterion: string;
    }> {
        const newAchievement = await Prisma.achievements.create({
            data,
        });

        return {
            id: newAchievement.id,
            name: newAchievement.name,
            criterion: newAchievement.criterion,
        };
    }

    public async delete(id: string): Promise<void> {
        await Prisma.userAchievements.deleteMany({
            where: {
                achievementId: id,
            },
        });

        await Prisma.achievements.delete({
            where: {
                id,
            },
        });
    }

}