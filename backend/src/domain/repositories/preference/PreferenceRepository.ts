import Prisma from "../../../infrastructure/orm/Prisma";

export default class PreferenceRepository {

    public async findById(id: string): Promise<{
        typeId: string;
        typeName: string;
        typeDescription: string;
    } | null> {
        const preference = await Prisma.preferences.findUnique({
            where: {
                id,
            },
            include: {
                type: true,
            },
        });

        if (!preference) return null;

        return {
            typeId: preference.type.id,
            typeName: preference.type.name,
            typeDescription: preference.type.description,
        };
    }

    public async findByUser(userId: string): Promise<{
        typeId: string;
        typeName: string;
        typeDescription: string;
    }[]> {
        const preferences = await Prisma.preferences.findMany({
            where: {
                userId,
            },
            include: {
                type: true,
            },
            orderBy: {
                type: {
                    name: "asc",
                },
            },
        });

        return preferences.map(preference => ({
            typeId: preference.type.id,
            typeName: preference.type.name,
            typeDescription: preference.type.description,
        }));
    }

    public async create(userId: string, typeIds: string[]): Promise<{
        id: string;
        userId: string;
        typeId: string;
    }[]> {
        const createdPreferences = [];

        for (const typeId of typeIds) {
            const existingPreference = await Prisma.preferences.findFirst({
                where: {
                    userId,
                    typeId,
                },
            });

            if (!existingPreference) {
                const newPreference = await Prisma.preferences.create({
                    data: {
                        userId,
                        typeId,
                    },
                });
                createdPreferences.push(newPreference);
            }
        }

        return createdPreferences;
    }

    public async delete(ids: string[]): Promise<void> {
        await Prisma.preferences.deleteMany({
            where: {
                id: {
                    in: ids,
                },
            },
        });
    }

}