export class PreferencesCreateDTO {
    userId: string;
    typeId: Array<string>;

    public constructor(userId: string, typeId: Array<string>) {
        this.userId = userId;
        this.typeId = typeId;
    }
}
