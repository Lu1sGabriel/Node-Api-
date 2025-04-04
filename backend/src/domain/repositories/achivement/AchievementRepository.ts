import Prisma from "../../../infrastructure/orm/Prisma";

export default class AchievementRepository {

    public async findAll(): Promise<any[]> {
        const achievements = await Prisma.achievements.findMany({
            orderBy: { name: "asc" },
        });

        return achievements.map(this.mapAchievementData);
    }

    public async findById(id: string): Promise<any | null> {
        const achievement = await Prisma.achievements.findUnique({ where: { id } });

        if (!achievement) {
            return null;
        }

        return this.mapAchievementData(achievement);
    }

    public async findByCriterion(criterion: string): Promise<any | null> {
        const achievement = await Prisma.achievements.findFirst({ where: { criterion } });

        if (!achievement) {
            return null;
        }

        return this.mapAchievementData(achievement);
    }

    public async create(data: { name: string; criterion: string }): Promise<any> {
        const newAchievement = await Prisma.achievements.create({ data });

        return this.mapAchievementData(newAchievement);
    }

    public async delete(id: string): Promise<void> {
        await Prisma.userAchievements.deleteMany({ where: { achievementId: id } });
        await Prisma.achievements.delete({ where: { id } });
    }

    private mapAchievementData(achievement: any) {
        return {
            id: achievement.id,
            name: achievement.name,
            criterion: achievement.criterion,
        };
    }

}