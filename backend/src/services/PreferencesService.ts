import { PreferencesCreateDTO } from "../dtos/PreferenceDTO";
import { BadRequestError, NotFoundError } from "../helpers/ApiErrors";
import PreferencesRepository from "../repositories/PreferencesRepository";
import UserService from "./UserService";

export default class PreferencesService {
    private readonly preferencesRepository: PreferencesRepository;
    private readonly userService: UserService;

    public constructor(preferencesRepository: PreferencesRepository = new PreferencesRepository(), userService: UserService = new UserService()) {
        this.preferencesRepository = preferencesRepository;
        this.userService = userService;
    }

    public async findByUser(userId: string): Promise<any> {
        await this.userService.findById(userId);
        const preferences = await this.preferencesRepository.findByUser(userId);
        if (!preferences) {
            throw new NotFoundError("Preferences not found");
        }
        return preferences;
    }

    public async create(dto: PreferencesCreateDTO): Promise<any> {
        if (!dto.userId || !dto.typeId || dto.typeId.length === 0) {
            throw new BadRequestError("User ID and Type IDs are required");
        }

        await this.userService.findById(dto.userId);

        return this.preferencesRepository.create(dto.userId, dto.typeId);
    }

    public async delete(ids: Array<string>): Promise<void> {
        if (!ids || ids.length === 0) {
            throw new BadRequestError("Preference IDs are required");
        }
        await this.preferencesRepository.delete(ids);
    }

}