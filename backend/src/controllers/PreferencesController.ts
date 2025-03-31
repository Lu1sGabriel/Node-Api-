import { Express, Request, Response, Router } from 'express';
import PreferencesService from '../services/PreferencesService';
import { PreferencesCreateDTO } from '../dtos/PreferenceDTO';

export default function PreferencesController(server: Express): void {

    const router = Router();
    const preferencesService = new PreferencesService();
    server.use('/user/preferences', router);

    router.get("/:userId", async (req: Request, res: Response) => {
        const { userId } = req.params;
        const preferences = await preferencesService.findByUser(userId);
        res.status(200).json({ status: "success", data: preferences });
    });

    router.post("/define", async (req: Request, res: Response) => {
        const { userId, typeId } = req.body;
        const dto = new PreferencesCreateDTO(userId, typeId);
        const preferences = await preferencesService.create(dto);
        res.status(201).json({ status: "success", data: preferences });
    });

    router.delete("/", async (req: Request, res: Response) => {
        const { preferenceIds } = req.body;

        await preferencesService.delete(preferenceIds);
        res.status(204).json({ status: "success", message: "Preferences deleted successfully" });
    });


}