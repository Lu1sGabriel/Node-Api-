import { ActivityAddressCreatoDTO, ActivityAddressUpdateDTO } from "../../../presentation/dto/activityAddress/ActivityAddressDTO";

export default interface IActvityAddressService {

    getByActivity(id: string): Promise<any>;
    getById(id: string): Promise<any>;
    create(dto: ActivityAddressCreatoDTO): Promise<any>;
    update(dto: ActivityAddressUpdateDTO): Promise<any>;

}