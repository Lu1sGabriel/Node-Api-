import { ActivityParticipantCreateDTO, ActivityParticipantUpdateDTO } from "../../../presentation/dto/activityParticipant/ActivityParticipantDTO";

export default interface IActivityParticipantService {
    findByActivity(activityId: string): Promise<any[]>;
    findByUser(userId: string): Promise<any[]>;
    create(dto: ActivityParticipantCreateDTO): Promise<any>;
    update(id: string, dto: ActivityParticipantUpdateDTO): Promise<any>;
    delete(id: string): Promise<void>;
    confirmParticipation(participantId: string, confirmationCode: string): Promise<void>;
}
