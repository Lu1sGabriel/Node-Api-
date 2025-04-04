import Prisma from "../../../infrastructure/orm/Prisma";

export default class ActivityRepository {

    public async findAll(): Promise<any[]> {
        const activities = await Prisma.activities.findMany({
            where: { deletedAt: null },
            orderBy: { scheduledDate: "asc" },
        });

        return activities.map(this.mapActivityData);
    }

    public async findById(id: string): Promise<any | null> {
        const activity = await Prisma.activities.findUnique({
            where: {
                id,
                deletedAt: null
            }
        });

        if (!activity) {
            return null;
        }

        return this.mapActivityData(activity);
    }

    public async create(data: {
        title: string;
        description: string;
        type: string;
        confirmationCode: string;
        image: string;
        scheduledDate: Date;
        private: boolean;
        creatorId: string;
    }): Promise<any> {
        const newActivity = await Prisma.activities.create({ data });

        return this.mapActivityData(newActivity);
    }

    public async update(id: string, data: Partial<{
        title: string;
        description: string;
        type: string;
        confirmationCode: string;
        image: string;
        scheduledDate: Date;
        deletedAt?: Date;
        completedAt?: Date;
        private: boolean;
    }>): Promise<any> {
        return Prisma.activities.update({ where: { id }, data });
    }

    public async delete(id: string): Promise<void> {
        await Prisma.activities.update({ where: { id }, data: { deletedAt: new Date() } });
    }

    private mapActivityData(activity: any) {
        return {
            id: activity.id,
            title: activity.title,
            description: activity.description,
            type: activity.type,
            confirmationCode: activity.confirmationCode,
            image: activity.image,
            scheduledDate: activity.scheduledDate,
            createdAt: activity.createdAt,
            deletedAt: activity.deletedAt ?? undefined,
            completedAt: activity.completedAt ?? undefined,
            private: activity.private,
            creatorId: activity.creatorId,
        };
    }

}