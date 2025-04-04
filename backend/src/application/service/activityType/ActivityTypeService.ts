import ActivityTypeRepository from "../../../domain/repositories/activityType/ActivityTypeRepository";
import { ActivityTypeCreateDTO } from "../../../presentation/dto/activityType/ActivityTypeDTO";
import { BadRequestError, NotFoundError } from "../../../shared/utils/ApiError";
import IActivityTypeService from "./IActivityTypeService";

export default class ActivityTypeService implements IActivityTypeService {
    private readonly activityTypeRepository: ActivityTypeRepository;

    constructor() {
        this.activityTypeRepository = new ActivityTypeRepository();
    }

    async findAll(): Promise<any[]> {
        const activityTypes = await this.activityTypeRepository.findAll();
        if (activityTypes.length === 0) {
            throw new NotFoundError("No activity types found.");
        }
        return activityTypes;
    }

    async create(dto: ActivityTypeCreateDTO): Promise<any> {
        if (!dto.name || dto.name.trim() === "") {
            throw new BadRequestError("Name is required and cannot be empty.");
        }
        if (!dto.description || dto.description.trim() === "") {
            throw new BadRequestError("Description is required and cannot be empty.");
        }
        if (!dto.image || dto.image.trim() === "") {
            throw new BadRequestError("Image is required and cannot be empty.");
        }

        return await this.activityTypeRepository.create(dto);
    }


}