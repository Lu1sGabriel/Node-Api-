import Prisma from "../../../infrastructure/orm/Prisma";

export default class ActivityParticipantRepository {

    public async findByActivity(activityId: string): Promise<{
        id: string;
        userId: string;
        approved: boolean;
        confirmedAt?: Date;
    }[]> {
        const participants = await Prisma.activityParticipants.findMany({
            where: {
                activityId,
                user: {
                    deletedAt: null
                }
            },
            include: {
                user: true
            },
            orderBy: {
                confirmedAt: "asc"
            }
        });

        return participants.map(participant => ({
            id: participant.id,
            userId: participant.userId,
            approved: participant.approved,
            confirmedAt: participant.confirmedAt ?? undefined
        }));
    }

    public async findByUser(userId: string): Promise<{
        id: string;
        activityId: string;
        approved: boolean;
        confirmedAt?: Date;
    }[]> {
        const activities = await Prisma.activityParticipants.findMany({
            where: {
                userId,
                user: {
                    deletedAt: null
                }
            },
            include: {
                activity: true
            },
            orderBy: {
                confirmedAt: "asc"
            }
        });

        return activities.map(activity => ({
            id: activity.id,
            activityId: activity.activityId,
            approved: activity.approved,
            confirmedAt: activity.confirmedAt ?? undefined
        }));
    }

    public async create(activityId: string, userId: string, approved: boolean, confirmedAt?: Date): Promise<{
        id: string;
        activityId: string;
        userId: string;
        approved: boolean;
        confirmedAt?: Date;
    }> {
        const newParticipant = await Prisma.activityParticipants.create({
            data: {
                activityId,
                userId,
                approved,
                confirmedAt
            }
        });

        return {
            id: newParticipant.id,
            activityId: newParticipant.activityId,
            userId: newParticipant.userId,
            approved: newParticipant.approved,
            confirmedAt: newParticipant.confirmedAt ?? undefined
        };
    }

    public async update(id: string, approved: boolean, confirmedAt?: Date): Promise<void> {
        await Prisma.activityParticipants.update({
            where: {
                id
            },
            data: {
                approved,
                confirmedAt
            }
        });
    }

    public async delete(id: string): Promise<void> {
        await Prisma.activityParticipants.delete({
            where: {
                id
            }
        });
    }

}
