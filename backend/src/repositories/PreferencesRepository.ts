import Prisma from "../orms/Prisma";
import { Create } from "../dtos/PreferenceDTO";

export default class PreferencesRepository {

    public findById(id: string): Promise<any> {
        return Prisma.preferences.findUnique({
            where: {
                id: id,
            },
        });
    }

    public async findByUser(userId: string): Promise<any> {
        return await Prisma.preferences.findMany({
            where: {
                userId: userId,
            },
        });
    }

    public async create(data: Create) {
        return await Prisma.preferences.create({
            data,
        });
    }

    public async delete(id: string) {
        return await Prisma.preferences.deleteMany({
            where: {
                id: id,
            },
        });
    }

}