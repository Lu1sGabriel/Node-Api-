export class ActivityAddressCreatoDTO {
    activityId: string;
    latitude: number;
    longitude: number;

    constructor(activityId: string, latitude: number, longitude: number) {
        this.activityId = activityId;
        this.latitude = latitude;
        this.longitude = longitude;
    }


}

export class ActivityAddressUpdateDTO {
    activityId: string;
    latitude: number;
    longitude: number;

    constructor(activityId: string, latitude: number, longitude: number) {
        this.activityId = activityId;
        this.latitude = latitude;
        this.longitude = longitude;
    }


}