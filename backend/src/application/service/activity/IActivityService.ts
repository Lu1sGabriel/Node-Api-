import { ActivityCreateDTO, ActivityUpdateDTO } from "../../../presentation/dto/activity/ActivityDTO";

export default interface IActivityService {
    findAll(userId: string, filterType?: string): Promise<any[]>;
    findById(id: string, requesterId: string): Promise<any | null>;
    create(dto: ActivityCreateDTO): Promise<any>;
    update(id: string, dto: ActivityUpdateDTO, requesterId: string): Promise<any>;
    delete(id: string, requesterId: string): Promise<void>;
    completeActivity(id: string, requesterId: string): Promise<void>;
}
