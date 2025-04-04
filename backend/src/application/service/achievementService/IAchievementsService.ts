export default interface IAchievementsService {
    getAll(): Promise<any>;
    create(name: string, criterion: string): Promise<any>;
}