import UserAchievementRepository from "../../../domain/repositories/userAchievementRepository/UserAchievementRepository";
import AchievementRepository from "../../../domain/repositories/achivement/AchievementRepository";
import UserRepository from "../../../domain/repositories/user/UserRepository";
import { NotFoundError } from "../../../shared/utils/ApiError";
import { AchievementEnum } from "../../../domain/repositories/achivement/AchievementEnum";
import { IUserAchievementService } from "./IUserAchievementService";

export default class UserAchievementService implements IUserAchievementService {
    private readonly xpPerAction = 100;
    private readonly xpToLevelUp = 1000;
    private readonly firstParticipationBonus = 50;
    private readonly firstCreationBonus = 50;
    private readonly firstCompletionBonus = 50;
    private readonly repeatedCompletionXP = 25;

    constructor(
        private readonly userAchievementsRepository = new UserAchievementRepository(),
        private readonly achievementsRepository = new AchievementRepository(),
        private readonly userRepository = new UserRepository()
    ) { }

    public async confirmActivityParticipation(userId: string, creatorId: string): Promise<void> {
        this.validateUserIds(userId, creatorId);

        await this.handleActivityParticipation(userId, creatorId);

        if (!(await this.hasAchievement(userId, AchievementEnum.FIRST_CHECK_IN))) {
            await this.assignAchievementIfNotExists(userId, AchievementEnum.FIRST_CHECK_IN);
        }
    }

    public async completeActivity(userId: string): Promise<void> {
        this.validateUserId(userId);

        const hasMasterExplorer = await this.hasAchievement(userId, AchievementEnum.MASTER_EXPLORER);
        if (!hasMasterExplorer) {
            await this.assignAchievementIfNotExists(userId, AchievementEnum.MASTER_EXPLORER);
            await this.incrementUserXp(userId, this.firstCompletionBonus);
        } else {
            await this.incrementUserXp(userId, this.repeatedCompletionXP);
        }

        await this.checkAndAssignAchievements(userId, { isCompletion: true });
    }


    private async handleActivityParticipation(userId: string, creatorId: string): Promise<void> {
        await this.getUserOrThrow(userId);
        await this.getUserOrThrow(creatorId);

        await this.incrementUserXp(userId, this.xpPerAction);
        await this.incrementUserXp(creatorId, this.xpPerAction);

        if (!(await this.hasAchievement(userId, AchievementEnum.FIRST_ACTIVITY_JOIN))) {
            await this.incrementUserXp(userId, this.firstParticipationBonus);
            await this.assignAchievementIfNotExists(userId, AchievementEnum.FIRST_ACTIVITY_JOIN);
        }

        if (!(await this.hasAchievement(creatorId, AchievementEnum.FIRST_ACTIVITY_CREATED))) {
            await this.incrementUserXp(creatorId, this.firstCreationBonus);
            await this.assignAchievementIfNotExists(creatorId, AchievementEnum.FIRST_ACTIVITY_CREATED);
        }

        await this.checkAndAssignAchievements(userId, { isCreator: false });
        await this.checkAndAssignAchievements(creatorId, { isCreator: true });
    }

    public async handleActivityCreation(userId: string): Promise<void> {
        this.validateUserId(userId);

        await this.incrementUserXp(userId, this.firstCreationBonus);
        await this.assignAchievementIfNotExists(userId, AchievementEnum.FIRST_ACTIVITY_CREATED);

        await this.checkAndAssignAchievements(userId, { isCreator: true });
    }

    public async incrementUserXp(userId: string, xpAmount: number): Promise<void> {
        const user = await this.getUserOrThrow(userId);

        user.xp += xpAmount;

        if (user.xp >= this.xpToLevelUp) {
            user.level += 1;
            user.xp -= this.xpToLevelUp;

            const levelUpBonus = user.level * 10;
            user.xp += levelUpBonus;

            await this.assignAchievementIfNotExists(userId, AchievementEnum.LEVEL_UP);
        }

        await this.userRepository.update(userId, { xp: user.xp, level: user.level });
    }

    public async hasAchievement(userId: string, criterion: AchievementEnum): Promise<boolean> {
        const existingAchievement = await this.userAchievementsRepository.findByUserAndCriterion(userId, criterion);
        return existingAchievement != null;
    }

    public async assignAchievementIfNotExists(userId: string, criterion: AchievementEnum): Promise<void> {
        if (!(await this.hasAchievement(userId, criterion))) {
            const achievement = await this.achievementsRepository.findByCriterion(criterion);
            if (achievement) {
                await this.userAchievementsRepository.create(userId, [achievement.id]);
            }
        }
    }

    private async checkAndAssignAchievements(userId: string, context: { isCreator?: boolean, isCompletion?: boolean }) {
        if (context.isCreator) {
            await this.assignAchievementIfNotExists(userId, AchievementEnum.EVENT_ORGANIZER);
        }

        if (context.isCompletion) {
            const hasMasterExplorer = await this.hasAchievement(userId, AchievementEnum.MASTER_EXPLORER);
            if (!hasMasterExplorer) {
                await this.assignAchievementIfNotExists(userId, AchievementEnum.MASTER_EXPLORER);
                await this.incrementUserXp(userId, this.firstCompletionBonus);
            } else {
                await this.incrementUserXp(userId, this.repeatedCompletionXP);
            }
        }

        const user = await this.getUserOrThrow(userId);
        if (user.level >= 5) {
            await this.assignAchievementIfNotExists(userId, AchievementEnum.SOCIAL_BUTTERFLY);
        }
    }

    private async getUserOrThrow(userId: string): Promise<any> {
        const user = await this.userRepository.findById(userId);
        if (!user || user.deletedAt) {
            throw new NotFoundError("User not found or inactive.");
        }
        return user;
    }

    private validateUserIds(userId: string, creatorId: string): void {
        if (!userId || !creatorId) {
            throw new NotFoundError("User ID and Creator ID are required.");
        }
    }

    private validateUserId(userId: string): void {
        if (!userId) {
            throw new NotFoundError("User ID is required.");
        }
    }

}