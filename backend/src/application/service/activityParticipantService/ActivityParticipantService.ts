import ActivityParticipantRepository from "../../../domain/repositories/activityParticipant/ActivityParticipantRepository";
import ActivityRepository from "../../../domain/repositories/activity/ActivitieRepository";
import { ActivityParticipantCreateDTO, ActivityParticipantUpdateDTO } from "../../../presentation/dto/activityParticipant/ActivityParticipantDTO";
import { BadRequestError, NotFoundError, ForbiddenError } from "../../../shared/utils/ApiError";
import IUserService from "../user/IUserService";
import IActivityParticipantService from "./IActivityParticipantService";
import UserService from "../user/UserService";

export default class ActivityParticipantService implements IActivityParticipantService {
    private readonly activityParticipantRepository: ActivityParticipantRepository;
    private readonly activityRepository: ActivityRepository;
    private readonly userService: IUserService;

    constructor() {
        this.activityParticipantRepository = new ActivityParticipantRepository();
        this.activityRepository = new ActivityRepository();
        this.userService = new UserService();
    }

    findByActivity(activityId: string): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    findByUser(userId: string): Promise<any[]> {
        throw new Error("Method not implemented.");
    }
    create(dto: ActivityParticipantCreateDTO): Promise<any> {
        throw new Error("Method not implemented.");
    }
    update(id: string, dto: ActivityParticipantUpdateDTO): Promise<any> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }
    confirmParticipation(participantId: string, confirmationCode: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}
