export class ActivityParticipantCreateDTO {
    public activityId: string;
    public userId: string;
    public approved: boolean;
    public confirmedAt?: Date;

    constructor(activityId: string, userId: string, approved: boolean, confirmedAt?: Date) {
        this.activityId = activityId;
        this.userId = userId;
        this.approved = approved;
        this.confirmedAt = confirmedAt;
    }
}

export class ActivityParticipantUpdateDTO {
    public approved?: boolean;
    public confirmedAt?: Date;

    constructor(approved?: boolean, confirmedAt?: Date) {
        this.approved = approved;
        this.confirmedAt = confirmedAt;
    }
}
