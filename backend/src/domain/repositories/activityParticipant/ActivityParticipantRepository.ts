import Prisma from "../../../infrastructure/orm/Prisma";

export default class ActivityParticipantRepository {

    public async findByActivity(activityId: string): Promise<any[]> {
        return Prisma.activityParticipants.findMany({
            where: {
                activityId,
                user: { deletedAt: null }
            },
            include: { user: true },
            orderBy: { confirmedAt: "asc" }
        }).then(participants => participants.map(this.mapParticipantData));
    }

    public async findParticipantById(participantId: string): Promise<any | null> {
        const participant = await Prisma.activityParticipants.findUnique({
            where: { id: participantId },
            include: { user: true }
        });

        if (!participant) return null;

        return this.mapParticipantData(participant);
    }

    public async findByUser(userId: string): Promise<any[]> {
        const activities = await Prisma.activityParticipants.findMany({
            where: {
                userId,
                user: { deletedAt: null }
            },
            include: { activity: true },
            orderBy: { confirmedAt: "asc" }
        });
        return activities.map(this.mapParticipantData);
    }

    public async create(activityId: string, userId: string, approved: boolean, confirmedAt?: Date): Promise<any> {
        const newParticipant = await Prisma.activityParticipants.create({
            data: { activityId, userId, approved, confirmedAt }
        });
        return this.mapParticipantData(newParticipant);
    }

    public async update(id: string, data: Partial<{ approved: boolean; confirmedAt?: Date }>): Promise<any> {
        return Prisma.activityParticipants.update({
            where: { id },
            data
        });
    }

    public async delete(id: string): Promise<void> {
        await Prisma.activityParticipants.delete({ where: { id } });
    }

    private mapParticipantData(participant: any) {
        return {
            id: participant.id,
            userId: participant.userId,
            activityId: participant.activityId,
            approved: participant.approved,
            confirmedAt: participant.confirmedAt ?? undefined
        };
    }

}