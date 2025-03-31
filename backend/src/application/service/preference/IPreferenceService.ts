import { PreferencesCreateDTO } from "../../../presentation/dto/preference/PreferenceDTO";

export interface IPreferenceService {
    findByUser(userId: string): Promise<any>;
    create(dto: PreferencesCreateDTO): Promise<any>;
    delete(ids: Array<string>): Promise<void>;
}
