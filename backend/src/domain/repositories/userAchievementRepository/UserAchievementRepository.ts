import Prisma from "../../../infrastructure/orm/Prisma";

export default class UserAchievementRepository {
    public async findByUser(userId: string): Promise<any[]> {
        const userAchievements = await Prisma.userAchievements.findMany({
            where: {
                userId,
                user: { deletedAt: null },
            },
            include: { achievement: true },
            orderBy: { achievement: { name: "asc" } },
        });

        return userAchievements.map(this.mapUserAchievementData);
    }

    public async findByUserAndCriterion(userId: string, criterion: string): Promise<any | null> {
        const userAchievement = await Prisma.userAchievements.findFirst({
            where: {
                userId,
                achievement: { criterion },
                user: { deletedAt: null },
            },
            include: { achievement: true },
        });

        if (!userAchievement) return null;

        return this.mapUserAchievementData(userAchievement);
    }

    public async create(userId: string, achievementIds: string[]): Promise<any[]> {
        const createdAchievements: any[] = [];

        for (const achievementId of achievementIds) {
            const existingUserAchievement = await Prisma.userAchievements.findFirst({
                where: { userId, achievementId },
            });

            if (!existingUserAchievement) {
                const newUserAchievement = await Prisma.userAchievements.create({
                    data: { userId, achievementId },
                });
                createdAchievements.push(this.mapUserAchievementData(newUserAchievement));
            }
        }

        return createdAchievements;
    }

    public async delete(ids: string[]): Promise<void> {
        await Prisma.userAchievements.deleteMany({
            where: { id: { in: ids } },
        });
    }

    private mapUserAchievementData(userAchievement: any) {
        return {
            achievementId: userAchievement.achievement.id,
            achievementName: userAchievement.achievement.name,
            achievementCriterion: userAchievement.achievement.criterion,
        };
    }

}