import Prisma from "../../../infrastructure/orm/Prisma";

export default class ActivityAddressRepository {

    public async findByActivity(activityId: string): Promise<{
        id: string;
        latitude: number;
        longitude: number;
    } | null> {
        const address = await Prisma.activityAddresses.findUnique({
            where: {
                activityId
            }
        });

        if (address == null) {
            return null;
        }

        return {
            id: address.id,
            latitude: address.latitude,
            longitude: address.longitude
        };
    }

    public async create(activityId: string, latitude: number, longitude: number): Promise<{
        id: string;
        latitude: number;
        longitude: number;
    }> {
        const newAddress = await Prisma.activityAddresses.create({
            data: {
                activityId,
                latitude,
                longitude
            }
        });

        return {
            id: newAddress.id,
            latitude: newAddress.latitude,
            longitude: newAddress.longitude
        };
    }

    public async update(activityId: string, latitude: number, longitude: number): Promise<void> {
        await Prisma.activityAddresses.update({
            where: {
                activityId
            },
            data: {
                latitude,
                longitude
            }
        });
    }

    public async delete(activityId: string): Promise<void> {
        await Prisma.activityAddresses.delete({
            where: {
                activityId
            }
        });
    }

}