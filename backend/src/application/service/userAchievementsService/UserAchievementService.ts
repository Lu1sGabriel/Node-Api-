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

    public constructor(
        private readonly userAchievementsRepository = new UserAchievementRepository(),
        private readonly achievementsRepository = new AchievementRepository(),
        private readonly userRepository = new UserRepository()
    ) { }

    public async confirmActivityParticipation(userId: string, creatorId: string): Promise<void> {
        if (userId == null || creatorId == null) {
            throw new NotFoundError("User ID and Creator ID are required.");
        }

        await Promise.all([
            this.handleActivityParticipation(userId, creatorId),
            this.assignAchievementIfNotExists(userId, AchievementEnum.FIRST_CHECK_IN),
            this.assignAchievementIfNotExists(creatorId, AchievementEnum.ACTIVITY_CREATED)
        ]);
    }

    private async handleActivityParticipation(userId: string, creatorId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        const creator = await this.userRepository.findById(creatorId);

        if (user == null || creator == null) {
            throw new NotFoundError("User or creator not found.");
        }

        if (user.xp == null) {
            user.xp = 0;
        }
        user.xp += this.xpPerAction;

        if (!(await this.hasAchievement(userId, AchievementEnum.FIRST_ACTIVITY_JOIN))) {
            user.xp += this.firstParticipationBonus;
            await this.assignAchievementIfNotExists(userId, AchievementEnum.FIRST_ACTIVITY_JOIN);
        }

        if (creator.xp == null) {
            creator.xp = 0;
        }
        creator.xp += this.xpPerAction;

        if (!(await this.hasAchievement(creatorId, AchievementEnum.FIRST_ACTIVITY_CREATED))) {
            creator.xp += this.firstCreationBonus;
            await this.assignAchievementIfNotExists(creatorId, AchievementEnum.FIRST_ACTIVITY_CREATED);
        }

        await Promise.all([
            this.incrementUserXp(userId, user.xp),
            this.incrementUserXp(creatorId, creator.xp)
        ]);
    }

    public async incrementUserXp(userId: string, newXp: number): Promise<void> { // Agora é público
        const user = await this.userRepository.findById(userId);
        if (user == null) {
            throw new NotFoundError("User not found.");
        }

        if (user.deletedAt != null) {
            throw new NotFoundError("User is inactive.");
        }

        user.xp = newXp;

        if (user.level == null) {
            user.level = 1;
        }

        if (user.xp >= this.xpToLevelUp) {
            user.level += 1;
            user.xp -= this.xpToLevelUp;

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
            if (achievement != null) {
                await this.userAchievementsRepository.create(userId, [achievement.id]);
            }
        }
    }

}