import { AchievementEnum } from "../../../domain/repositories/achivement/AchievementEnum";

export interface IUserAchievementService {
    confirmActivityParticipation(userId: string, creatorId: string): Promise<void>;
    incrementUserXp(userId: string, newXp: number): Promise<void>;
    hasAchievement(userId: string, criterion: AchievementEnum): Promise<boolean>;
    assignAchievementIfNotExists(userId: string, criterion: AchievementEnum): Promise<void>;
}
