export class PreferencesCreateDTO {
    userId: string;
    typeId: string;

    public constructor(userId: string, typeId: string) {
        this.userId = userId;
        this.typeId = typeId;
    }
}
