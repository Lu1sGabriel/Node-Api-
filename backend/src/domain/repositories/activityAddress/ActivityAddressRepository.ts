import Prisma from "../../../infrastructure/orm/Prisma";

export default class ActivityAddressRepository {

    public async findById(id: string): Promise<any | null> {
        const address = await Prisma.activityAddresses.findUnique({
            where: { id },
        });

        if (!address) return null;

        return this.mapAddressData(address);

    }

    public async findByActivity(activityId: string): Promise<any | null> {
        const address = await Prisma.activityAddresses.findUnique({
            where: { activityId },
        });

        if (!address) return null;

        return this.mapAddressData(address);
    }

    public async create(data: { activityId: string; latitude: number; longitude: number }): Promise<any> {
        const newAddress = await Prisma.activityAddresses.create({ data });

        return this.mapAddressData(newAddress);
    }

    public async update(activityId: string, data: Partial<{ latitude: number; longitude: number }>): Promise<any> {
        return Prisma.activityAddresses.update({
            where: { activityId },
            data,
        });
    }

    public async delete(activityId: string): Promise<void> {
        await Prisma.activityAddresses.delete({ where: { activityId } });
    }

    private mapAddressData(address: any) {
        return {
            id: address.id,
            latitude: address.latitude,
            longitude: address.longitude,
        };
    }

}