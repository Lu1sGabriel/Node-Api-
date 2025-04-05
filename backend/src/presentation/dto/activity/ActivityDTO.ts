export class ActivityCreateDTO {
    public title: string;
    public description: string;
    public type: string;
    public confirmationCode: string;
    public image: string;
    public scheduledDate: Date;
    public private: boolean;
    public creatorId: string;

    constructor(
        title: string,
        description: string,
        type: string,
        confirmationCode: string,
        image: string,
        scheduledDate: Date,
        privateActivity: boolean,
        creatorId: string
    ) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.confirmationCode = confirmationCode;
        this.image = image;
        this.scheduledDate = scheduledDate;
        this.private = privateActivity;
        this.creatorId = creatorId;
    }
}

export class ActivityUpdateDTO {
    public title?: string;
    public description?: string;
    public type?: string;
    public confirmationCode?: string;
    public image?: string;
    public scheduledDate?: Date;
    public deletedAt?: Date;
    public completedAt?: Date;
    public private?: boolean;

    constructor(
        title?: string,
        description?: string,
        type?: string,
        confirmationCode?: string,
        image?: string,
        scheduledDate?: Date,
        deletedAt?: Date,
        completedAt?: Date,
        privateActivity?: boolean
    ) {
        this.title = title;
        this.description = description;
        this.type = type;
        this.confirmationCode = confirmationCode;
        this.image = image;
        this.scheduledDate = scheduledDate;
        this.deletedAt = deletedAt;
        this.completedAt = completedAt;
        this.private = privateActivity;
    }
}
