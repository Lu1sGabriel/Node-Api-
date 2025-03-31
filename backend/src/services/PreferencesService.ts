import { PreferencesCreateDTO } from "../dtos/PreferenceDTO";
import { BadRequestError, NotFoundError } from "../helpers/ApiErrors";
import PreferencesRepository from "../repositories/PreferencesRepository";

export default class PreferencesService {
    private readonly preferencesRepository: PreferencesRepository;

    public constructor(preferencesRepository: PreferencesRepository = new PreferencesRepository()) {
        this.preferencesRepository = preferencesRepository;
    }

    public async findByUser(userId: string): Promise<any> {
        const preferences = await this.preferencesRepository.findByUser(userId);
        if (!preferences) {
            throw new NotFoundError("Preferences not found");
        }
        return preferences;
    }

    public async create(dto: PreferencesCreateDTO): Promise<any> {
        if (!dto.userId || !dto.typeId) {
            throw new BadRequestError("User ID and Type ID are required");
        }
        return this.preferencesRepository.create(dto);
    }

    public async delete(ids: Array<string>): Promise<void> {
        if (!ids || ids.length === 0) {
            throw new BadRequestError("Preference IDs are required");
        }
        await Promise.all(
            ids.map(async (id) => {
                const preference = await this.preferencesRepository.findById(id);
                if (preference) {
                    await this.preferencesRepository.delete(id);
                }
            })
        );
    }

}