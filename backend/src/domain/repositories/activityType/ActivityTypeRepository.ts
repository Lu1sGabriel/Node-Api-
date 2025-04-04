import Prisma from "../../../infrastructure/orm/Prisma";

export default class ActivityTypeRepository {

    public async findAll(): Promise<any[]> {
        const activityTypes = await Prisma.activityTypes.findMany({
            orderBy: { name: "asc" },
        });
        return activityTypes.map(this.mapActivityTypeData);
    }

    public async create(data: { name: string; description: string; image: string }): Promise<any> {
        const newActivityType = await Prisma.activityTypes.create({ data });
        return this.mapActivityTypeData(newActivityType);
    }

    private mapActivityTypeData(activityType: any) {
        return {
            id: activityType.id,
            name: activityType.name,
            description: activityType.description,
            image: activityType.image,
        };
    }

}