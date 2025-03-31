import { Express, Request, Response, Router } from 'express';
import PreferencesService from '../services/PreferencesService';
import { PreferencesCreateDTO } from '../dtos/PreferenceDTO';

export default function PreferencesController(server: Express): void {

    const router = Router();
    const preferencesService = new PreferencesService();
    server.use('/user/preferences', router);

    router.get("/:userId", async (request: Request, response: Response) => {
        const { userId } = request.params;
        const preferences = await preferencesService.findByUser(userId);
        response.status(200).json(preferences);
    });

    router.post("/define", async (request: Request, response: Response) => {
        const { userId, typeId } = request.body;
        const dto = new PreferencesCreateDTO(userId, typeId);
        const preferences = await preferencesService.create(dto);
        response.status(201).json(preferences);
    });

    router.delete("/delete", async (request: Request, response: Response) => {
        const { preferenceIds } = request.body;

        await preferencesService.delete(preferenceIds);
        response.status(204).end();
    });

}