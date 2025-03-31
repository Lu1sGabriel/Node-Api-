import AchievementsRepository from "../../../domain/repositories/achivement/AchievementRepository";
import { BadRequestError } from "../../../shared/utils/ApiErrors";

export default class AchievementsService {

    private readonly achievementsRepository: AchievementsRepository;

    public constructor(
        achievementsRepository: AchievementsRepository = new AchievementsRepository()
    ) {
        this.achievementsRepository = achievementsRepository;
    }

    public async createAchievement(name: string, criterion: string): Promise<any> {
        const existingAchievements = await this.achievementsRepository.findAll();
        if (existingAchievements.some((a) => a.criterion === criterion)) {
            throw new BadRequestError("An achievement with this criterion already exists.");
        }

        return this.achievementsRepository.create({ name, criterion });
    }

    public async getAllAchievements(): Promise<any[]> {
        return this.achievementsRepository.findAll();
    }

}