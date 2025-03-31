import Prisma from "../orms/Prisma";
import { Create } from "../dtos/PreferenceDTO";

export default class PreferencesRepository {
    public async findById(userId: string): Promise<any> {
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

}