import UserAchievementsRepository from "../../../domain/repositories/userAchievementsRepository/UserAchievementsRepository";
import AchievementsRepository from "../../../domain/repositories/achivement/AchievementRepository";
import UserRepository from "../../../domain/repositories/user/UserRepository";
import { NotFoundError } from "../../../shared/utils/ApiError";

export default class UserAchievementsService {
    private readonly xpPerAction = 100;
    private readonly xpToLevelUp = 1000;
    private readonly firstParticipationBonus = 50;
    private readonly firstCreationBonus = 50;

    public constructor(
        private readonly userAchievementsRepository = new UserAchievementsRepository(),
        private readonly achievementsRepository = new AchievementsRepository(),
        private readonly userRepository = new UserRepository()
    ) { }

    public async confirmActivityParticipation(userId: string, creatorId: string): Promise<void> {
        if (userId == null || creatorId == null) {
            throw new NotFoundError("User ID and Creator ID are required.");
        }

        await Promise.all([
            this.handleActivityParticipation(userId, creatorId),
            this.assignAchievementIfNotExists(userId, "first-check-in"),
            this.assignAchievementIfNotExists(creatorId, "activity-created")
        ]);
    }

    private async handleActivityParticipation(userId: string, creatorId: string): Promise<void> {
        const user = await this.userRepository.findById(userId);
        const creator = await this.userRepository.findById(creatorId);

        if (user == null || creator == null) {
            throw new NotFoundError("User or creator not found.");
        }

        // Inicializa XP se for null
        if (user.xp == null) {
            user.xp = 0;
        }
        user.xp += this.xpPerAction;

        // Verifica se é a primeira participação do usuário
        const hasJoinedActivityBefore = await this.userAchievementsRepository.findByUser(userId);
        if (hasJoinedActivityBefore.length === 0) {
            user.xp += this.firstParticipationBonus;
            await this.assignAchievementIfNotExists(userId, "first-activity-join");
        }

        // Inicializa XP do criador se for null
        if (creator.xp == null) {
            creator.xp = 0;
        }
        creator.xp += this.xpPerAction;

        // Verifica se é a primeira atividade criada pelo usuário
        const hasCreatedActivityBefore = await this.userAchievementsRepository.findByUser(creatorId);
        if (hasCreatedActivityBefore.length === 0) {
            creator.xp += this.firstCreationBonus;
            await this.assignAchievementIfNotExists(creatorId, "first-activity-created");
        }

        await Promise.all([
            this.incrementUserXp(userId, user.xp),
            this.incrementUserXp(creatorId, creator.xp)
        ]);
    }

    private async incrementUserXp(userId: string, newXp: number): Promise<void> {
        const user = await this.userRepository.findById(userId);
        if (user == null) {
            throw new NotFoundError("User not found.");
        }

        if (user.deletedAt != null) {
            throw new NotFoundError("User is inactive.");
        }

        user.xp = newXp;

        // Inicializa nível se for null
        if (user.level == null) {
            user.level = 1;
        }

        // Subir de nível se atingir XP suficiente
        if (user.xp >= this.xpToLevelUp) {
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
