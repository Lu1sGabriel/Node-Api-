import UserAchievementsRepository from "../../../domain/repositories/userAchievementsRepository/UserAchievementsRepository";
import AchievementsRepository from "../../../domain/repositories/achivement/AchievementRepository";
import UserRepository from "../../../domain/repositories/user/UserRepository";
import { NotFoundError } from "../../../shared/utils/ApiError";

export default class UserAchievementsService {
    private readonly xpPerAction = 100;
    private readonly xpToLevelUp = 1000;

    public constructor(
        private readonly userAchievementsRepository = new UserAchievementsRepository(),
        private readonly achievementsRepository = new AchievementsRepository(),
        private readonly userRepository = new UserRepository()
    ) { }

    public async confirmActivityParticipation(userId: string, creatorId: string): Promise<void> {
        if (userId != null && creatorId != null) {
            await Promise.all([
                this.incrementUserXp(userId),
                this.incrementUserXp(creatorId),
                this.assignAchievementIfNotExists(userId, "first-check-in"),
                this.assignAchievementIfNotExists(creatorId, "activity-created")
            ]);
        }
    }

    private async incrementUserXp(userId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (user == null) {
            throw new NotFoundError("User not found.");
        }

        if (user.xp == null) {
            user.xp = 0;
        }
        user.xp += this.xpPerAction;

        if (user.xp >= this.xpToLevelUp) {
            if (user.level == null) {
                user.level = 1;
            }
            user.level += 1;
            user.xp -= this.xpToLevelUp;

            await this.assignAchievementIfNotExists(userId, "level-up");
        }

        await this.userRepository.update(userId, { xp: user.xp, level: user.level });
    }

    private async assignAchievementIfNotExists(userId: string, criterion: string): Promise<void> {
        const existingAchievements = await this.userAchievementsRepository.findByUser(userId);
        const hasAchievement = existingAchievements.some(a => a.achievementCriterion === criterion);

        if (!hasAchievement) {
            const achievement = await this.achievementsRepository.findByCriterion(criterion);
            if (achievement != null) {
                await this.userAchievementsRepository.create(userId, [achievement.id]);
            }
        }
    }

}