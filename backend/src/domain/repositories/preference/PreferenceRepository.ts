import Prisma from "../../../infrastructure/orm/Prisma";

export default class PreferenceRepository {
    public async findById(id: string): Promise<any | null> {
        const preference = await Prisma.preferences.findUnique({
            where: { id },
            include: { type: true },
        });

        if (!preference) {
            return null;
        }

        return this.mapPreferenceData(preference);
    }

    public async findByUser(userId: string): Promise<any[]> {
        const preferences = await Prisma.preferences.findMany({
            where: { userId },
            include: { type: true },
            orderBy: { type: { name: "asc" } },
        });

        return preferences.map(this.mapPreferenceData);
    }

    public async create(userId: string, typeIds: string[]): Promise<any[]> {
        const createdPreferences: any[] = [];

        for (const typeId of typeIds) {
            const existingPreference = await Prisma.preferences.findFirst({
                where: { userId, typeId },
            });

            if (!existingPreference) {
                const newPreference = await Prisma.preferences.create({
                    data: { userId, typeId },
                });
                createdPreferences.push(this.mapPreferenceData(newPreference));
            }
        }

        return createdPreferences;
    }

    public async delete(ids: string[]): Promise<void> {
        await Prisma.preferences.deleteMany({
            where: { id: { in: ids } },
        });
    }

    private mapPreferenceData(preference: any) {
        return {
            typeId: preference.type.id,
            typeName: preference.type.name,
            typeDescription: preference.type.description,
        };
    }

}