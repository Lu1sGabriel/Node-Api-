import Prisma from "../../../infrastructure/orm/Prisma";

export default class UserAchievementsRepository {

    public async findByUser(userId: string): Promise<{
        achievementId: string;
        achievementName: string;
        achievementCriterion: string;
    }[]> {
        const userAchievements = await Prisma.userAchievements.findMany({
            where: {
                userId,
                user: {
                    deletedAt: null,
                }
            },
            include: {
                achievement: true,
            },
            orderBy: {
                achievement: {
                    name: "asc",
                },
            },
        });

        return userAchievements.map(userAchievement => ({
            achievementId: userAchievement.achievement.id,
            achievementName: userAchievement.achievement.name,
            achievementCriterion: userAchievement.achievement.criterion,
        }));
    }

    public async findByUserAndCriterion(userId: string, criterion: string): Promise<{
        achievementId: string;
        achievementName: string;
        achievementCriterion: string;
    } | null> {
        const userAchievement = await Prisma.userAchievements.findFirst({
            where: {
                userId,
                achievement: {
                    criterion: criterion,
                },
                user: {
                    deletedAt: null,
                }
            },
            include: {
                achievement: true,
            }
        });

        if (userAchievement == null) {
            return null;
        }

        return {
            achievementId: userAchievement.achievement.id,
            achievementName: userAchievement.achievement.name,
            achievementCriterion: userAchievement.achievement.criterion,
        };
    }

    public async create(userId: string, achievementIds: string[]): Promise<{
        id: string;
        userId: string;
        achievementId: string;
    }[]> {
        const createdAchievements = [];

        for (const achievementId of achievementIds) {
            const existingUserAchievement = await Prisma.userAchievements.findFirst({
                where: {
                    userId,
                    achievementId,
                },
            });

            if (!existingUserAchievement) {
                const newUserAchievement = await Prisma.userAchievements.create({
                    data: {
                        userId,
                        achievementId,
                    },
                });
                createdAchievements.push(newUserAchievement);
            }
        }

        return createdAchievements;
    }

    public async delete(ids: string[]): Promise<void> {
        await Prisma.userAchievements.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
    }

}
