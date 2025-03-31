import AppError from "../handlers/AppError";
import PreferencesRepository from "../repositories/PreferencesRepository";

export default class PreferencesService {
    private readonly preferencesRepository: PreferencesRepository;

    public constructor(preferencesRepository: PreferencesRepository = new PreferencesRepository()) {
        this.preferencesRepository = preferencesRepository;
    }

    public async findByUser(userId: string): Promise<any> {
        const preferences = await this.preferencesRepository.findByUser(userId);
        if (!preferences) {
            throw new AppError("Preferências não encontradas", 404);
        }
        return preferences;
    }

    public async create(dto: any): Promise<any> {
        return this.preferencesRepository.create(dto);
    }

    public async delete(ids: Array<string>): Promise<void> {
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