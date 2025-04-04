import ActivityAddressRepository from "../../../domain/repositories/activityAddress/ActivityAddressRepository";
import { ActivityAddressCreatoDTO, ActivityAddressUpdateDTO } from "../../../presentation/dto/activityAddress/ActivityAddressDTO";
import { BadRequestError } from "../../../shared/utils/ApiError";
import IActvityAddressService from "./IActvityAddressService";

export default class ActivityAddressService implements IActvityAddressService {

    private readonly activityAddressRepository: ActivityAddressRepository;

    constructor() {
        this.activityAddressRepository = new ActivityAddressRepository();
    }


    async getById(id: string): Promise<any> {
        if (id == null) {
            throw new BadRequestError("ID is required.");
        }
        const activityAddress = await this.activityAddressRepository.findById(id);

        if (!activityAddress) {
            throw new BadRequestError("Activity Address not founded. ");
        }

        return activityAddress;
    }

    async getByActivity(activityId: string): Promise<any> {
        if (activityId == null) {
            throw new BadRequestError("Activity is required. ");
        }
        return await this.activityAddressRepository.findByActivity(activityId);
    }

    async create(dto: ActivityAddressCreatoDTO): Promise<any> {
        const activityAddresData = {
            activityId: dto.activityId,
            latitude: dto.latitude,
            longitude: dto.longitude
        }
        return await this.activityAddressRepository.create(activityAddresData);
    }

    async update(dto: ActivityAddressUpdateDTO): Promise<any> {
        const activityAddresData = {
            latitude: dto.latitude,
            longitude: dto.longitude
        }
        await this.activityAddressRepository.update(dto.activityId, activityAddresData);
    }

    async delete(id: string): Promise<void> {
        if (id == null) {
            throw new BadRequestError("ID is required. ");
        }
        await this.getById(id);
        await this.activityAddressRepository.delete(id);
    }

}