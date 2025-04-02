import Prisma from "../../../infrastructure/orm/Prisma";

export default class ActivityRepository {

    public async findAll(): Promise<{
        id: string;
        title: string;
        description: string;
        type: string;
        confirmationCode: string;
        image: string;
        scheduledDate: Date;
        createdAt: Date;
        deletedAt?: Date;
        completedAt?: Date;
        private: boolean;
        creatorId: string;
    }[]> {
        const activities = await Prisma.activities.findMany({
            where: {
                deletedAt: null
            },
            orderBy: {
                scheduledDate: "asc"
            }
        });

        return activities.map(activity => ({
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
            creatorId: activity.creatorId
        }));
    }

    public async findById(id: string): Promise<{
        id: string;
        title: string;
        description: string;
        type: string;
        confirmationCode: string;
        image: string;
        scheduledDate: Date;
        createdAt: Date;
        deletedAt?: Date;
        completedAt?: Date;
        private: boolean;
        creatorId: string;
    } | null> {
        const activity = await Prisma.activities.findUnique({
            where: {
                id
            }
        });

        if (activity == null) {
            return null;
        }

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
            creatorId: activity.creatorId
        };
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
    }): Promise<{
        id: string;
        title: string;
        description: string;
        type: string;
        confirmationCode: string;
        image: string;
        scheduledDate: Date;
        createdAt: Date;
        deletedAt?: Date;
        completedAt?: Date;
        private: boolean;
        creatorId: string;
    }> {
        const newActivity = await Prisma.activities.create({
            data
        });

        return {
            id: newActivity.id,
            title: newActivity.title,
            description: newActivity.description,
            type: newActivity.type,
            confirmationCode: newActivity.confirmationCode,
            image: newActivity.image,
            scheduledDate: newActivity.scheduledDate,
            createdAt: newActivity.createdAt,
            deletedAt: newActivity.deletedAt ?? undefined,
            completedAt: newActivity.completedAt ?? undefined,
            private: newActivity.private,
            creatorId: newActivity.creatorId
        };
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
    }>): Promise<void> {
        await Prisma.activities.update({
            where: {
                id
            },
            data
        });
    }

    public async delete(id: string): Promise<void> {
        await Prisma.activities.update({
            where: {
                id
            },
            data: {
                deletedAt: new Date()
            }
        });
    }

}