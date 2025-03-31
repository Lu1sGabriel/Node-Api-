import Prisma from "../orms/Prisma";
import { PreferencesCreateDTO } from "../dtos/PreferenceDTO";

export default class PreferencesRepository {

    public findById(id: string): Promise<any> {
        return Prisma.preferences.findUnique({
            where: {
                id: id,
            },
            omit: {
                userId: true,
            },
        });
    }

    public async findByUser(userId: string): Promise<any> {
        return await Prisma.preferences.findMany({
            where: {
                userId: userId,
            },
            omit: {
                userId: true,
            },
        });
    }

    public async create(data: PreferencesCreateDTO) {
        return await Prisma.preferences.create({
            data,
            omit: {
                userId: true,
            },
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