import UserAchievementsRepository from "../../../domain/repositories/userAchievementsRepository/UserAchievementsRepository";
import AchievementsRepository from "../../../domain/repositories/achivement/AchievementRepository";
import UserRepository from "../../../domain/repositories/user/UserRepository";
import { NotFoundError } from "../../../shared/utils/ApiError";

export default class UserAchievementsService {

    private readonly userAchievementsRepository: UserAchievementsRepository;
    private readonly achievementsRepository: AchievementsRepository;
    private readonly userRepository: UserRepository;

    private readonly xpPerAction = 100;
    private readonly xpToLevelUp = 1000;

    public constructor(
        userAchievementsRepository: UserAchievementsRepository = new UserAchievementsRepository(),
        achievementsRepository: AchievementsRepository = new AchievementsRepository(),
        userRepository: UserRepository = new UserRepository()
    ) {
        this.userAchievementsRepository = userAchievementsRepository;
        this.achievementsRepository = achievementsRepository;
        this.userRepository = userRepository;
    }

    public async confirmActivityParticipation(userId: string, creatorId: string): Promise<void> {
        await this.incrementUserXp(userId);

        await this.incrementUserXp(creatorId);

        await this.checkAndAssignAchievement(userId, "first-check-in");
        await this.checkAndAssignAchievement(creatorId, "activity-created");
    }

    private async incrementUserXp(userId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new NotFoundError("User not found.");

        let xp = user.xp || 0;
        let level = user.level || 1;

        xp += this.xpPerAction;

        if (xp >= this.xpToLevelUp) {
            level += 1;
            xp -= this.xpToLevelUp;

            await this.checkAndAssignAchievement(userId, "level-up");
        }

        await this.userRepository.update(userId, { xp, level });
    }

    private async checkAndAssignAchievement(userId: string, criterion: string): Promise<void> {
        const existingAchievements = await this.userAchievementsRepository.findByUser(userId);
        const hasAchievement = existingAchievements.some(
            (achievement) => achievement.achievementCriterion === criterion
        );

        if (!hasAchievement) {
            const achievement = await this.achievementsRepository.findAll();
            const matchingAchievement = achievement.find((a) => a.criterion === criterion);

            if (matchingAchievement) {
                await this.userAchievementsRepository.create(userId, [matchingAchievement.id]);
            }
        }
    }

}
