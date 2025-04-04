import { ActivityTypeCreateDTO } from "../../../presentation/dto/activityType/ActivityTypeDTO";

export default interface IActivityTypeService {
    findAll(): Promise<any[]>;
    create(dto: ActivityTypeCreateDTO): Promise<any>;
}
