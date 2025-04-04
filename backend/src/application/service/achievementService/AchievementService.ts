import AchievementRepository from "../../../domain/repositories/achivement/AchievementRepository";
import { BadRequestError } from "../../../shared/utils/ApiError";
import IAchievementsService from "./IAchievementsService";

export default class AchievementsService implements IAchievementsService {

    private readonly achievementsRepository: AchievementRepository;

    public constructor(
        achievementsRepository: AchievementRepository = new AchievementRepository()
    ) {
        this.achievementsRepository = achievementsRepository;
    }

    public async getAll(): Promise<any[]> {
        return this.achievementsRepository.findAll();
    }

    public async create(name: string, criterion: string): Promise<any> {
        const existingAchievements = await this.achievementsRepository.findAll();
        if (existingAchievements.some((a) => a.criterion === criterion)) {
            throw new BadRequestError("An achievement with this criterion already exists.");
        }

        return this.achievementsRepository.create({ name, criterion });
    }

}