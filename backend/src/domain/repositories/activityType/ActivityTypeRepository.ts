import Prisma from "../../../infrastructure/orm/Prisma";

export default class ActivityTypeRepository {

    public async findAll(): Promise<{
        id: string;
        name: string;
        description: string;
        image: string;
    }[]> {
        const activityTypes = await Prisma.activityTypes.findMany({
            orderBy: {
                name: "asc"
            }
        });

        return activityTypes.map(activityType => ({
            id: activityType.id,
            name: activityType.name,
            description: activityType.description,
            image: activityType.image
        }));
    }

    public async findById(id: string): Promise<{
        id: string;
        name: string;
        description: string;
        image: string;
    } | null> {
        const activityType = await Prisma.activityTypes.findUnique({
            where: {
                id
            }
        });

        if (activityType == null) {
            return null;
        }

        return {
            id: activityType.id,
            name: activityType.name,
            description: activityType.description,
            image: activityType.image
        };
    }

    public async create(data: {
        name: string;
        description: string;
        image: string;
    }): Promise<{
        id: string;
        name: string;
        description: string;
        image: string;
    }> {
        const newActivityType = await Prisma.activityTypes.create({
            data
        });

        return {
            id: newActivityType.id,
            name: newActivityType.name,
            description: newActivityType.description,
            image: newActivityType.image
        };
    }

    public async delete(id: string): Promise<void> {
        await Prisma.activityTypes.delete({
            where: {
                id
            }
        });
    }

}