import ActivityRepository from "../../../domain/repositories/activity/ActivitieRepository";
import ActivityParticipantRepository from "../../../domain/repositories/activityParticipant/ActivityParticipantRepository";
import PreferenceRepository from "../../../domain/repositories/preference/PreferenceRepository";
import UserAchievementService from "../userAchievementsService/UserAchievementService";
import { ActivityCreateDTO, ActivityUpdateDTO } from "../../../presentation/dto/activity/ActivityDTO";
import { BadRequestError, NotFoundError, ForbiddenError } from "../../../shared/utils/ApiError";
import IActivityService from "./IActivityService";
import { AchievementEnum } from "../../../domain/repositories/achivement/AchievementEnum";

export default class ActivityService implements IActivityService {
    private readonly activityRepository: ActivityRepository;
    private readonly activityParticipantRepository: ActivityParticipantRepository;
    private readonly preferenceRepository: PreferenceRepository;
    private readonly userAchievementService: UserAchievementService;

    constructor() {
        this.activityRepository = new ActivityRepository();
        this.activityParticipantRepository = new ActivityParticipantRepository();
        this.preferenceRepository = new PreferenceRepository();
        this.userAchievementService = new UserAchievementService();
    }

    async findAll(userId: string, filterType?: string): Promise<any[]> {
        const activities = await this.activityRepository.findAll();

        if (filterType) {
            return activities.filter(activity => activity.type === filterType);
        }

        return this.filterByUserPreferences(userId, activities);
    }

    async findById(id: string, requesterId: string): Promise<any | null> {
        const activity = await this.getActivityOrThrow(id);

        if (activity.creatorId !== requesterId) {
            delete activity.confirmationCode;
        }

        return activity;
    }

    async create(dto: ActivityCreateDTO): Promise<any> {
        this.validateActivityData(dto);

        const newActivity = await this.activityRepository.create(dto);

        await this.userAchievementService.handleActivityCreation(dto.creatorId);

        return newActivity;
    }


    async update(id: string, dto: ActivityUpdateDTO, requesterId: string): Promise<any> {
        const activity = await this.getActivityOrThrow(id);

        this.ensureActivityCreator(activity.creatorId, requesterId);

        return await this.activityRepository.update(id, dto);
    }

    async delete(id: string, requesterId: string): Promise<void> {
        const activity = await this.getActivityOrThrow(id);

        this.ensureActivityCreator(activity.creatorId, requesterId);

        await this.activityRepository.delete(id);
    }

    async completeActivity(id: string, requesterId: string): Promise<void> {
        const activity = await this.getActivityOrThrow(id);

        this.ensureActivityCreator(activity.creatorId, requesterId);

        await this.activityRepository.update(id, { completedAt: new Date() });
        await this.userAchievementService.completeActivity(requesterId);

    }

    async confirmParticipation(participantId: string, confirmationCode: string): Promise<void> {
        const participant = await this.getParticipantOrThrow(participantId);
        const activity = await this.getActivityOrThrow(participant.activityId);

        this.ensureParticipationApproval(participant);
        this.ensureCorrectConfirmationCode(activity, confirmationCode);
        this.ensureParticipationNotConfirmed(participant);
        this.ensureActivityNotCompleted(activity);

        await this.activityParticipantRepository.update(participantId, { confirmedAt: new Date() });

        await this.userAchievementService.confirmActivityParticipation(participant.userId, activity.creatorId);
    }

    private async getActivityOrThrow(id: string): Promise<any> {
        const activity = await this.activityRepository.findById(id);
        if (!activity) {
            throw new NotFoundError("Activity not found.");
        }
        return activity;
    }

    private async getParticipantOrThrow(participantId: string): Promise<any> {
        const participant = await this.activityParticipantRepository.findParticipantById(participantId);
        if (!participant) {
            throw new NotFoundError("Participant not found.");
        }
        return participant;
    }

    private ensureActivityCreator(creatorId: string, requesterId: string): void {
        if (creatorId !== requesterId) {
            throw new ForbiddenError("Only the creator can perform this action.");
        }
    }

    private ensureParticipationApproval(participant: any): void {
        if (!participant.approved) {
            throw new ForbiddenError("Only approved participants can check in.");
        }
    }

    private ensureCorrectConfirmationCode(activity: any, confirmationCode: string): void {
        if (activity.confirmationCode !== confirmationCode) {
            throw new ForbiddenError("Incorrect confirmation code.");
        }
    }

    private ensureParticipationNotConfirmed(participant: any): void {
        if (participant.confirmedAt) {
            throw new ForbiddenError("You have already confirmed participation in this activity.");
        }
    }

    private ensureActivityNotCompleted(activity: any): void {
        if (activity.completedAt) {
            throw new ForbiddenError("Cannot confirm presence in a completed activity.");
        }
    }

    private validateActivityData(dto: ActivityCreateDTO): void {
        if (!dto.title || !dto.description || !dto.type || !dto.confirmationCode || !dto.image || !dto.scheduledDate || !dto.creatorId) {
            throw new BadRequestError("All required fields must be provided.");
        }
    }

    private async filterByUserPreferences(userId: string, activities: any[]): Promise<any[]> {
        const preferences = await this.preferenceRepository.findByUser(userId);
        const preferredTypes = preferences.map(pref => pref.typeId);
        return activities.filter(activity => preferredTypes.includes(activity.type));
    }

}