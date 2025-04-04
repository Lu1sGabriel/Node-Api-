import { Express, Request, Response, Router } from "express";
import PreferencesService from "../../../application/service/preference/PreferencesService";
import { PreferencesCreateDTO } from "../../dto/preference/PreferenceDTO";
import authGuard from "../../../infrastructure/middleware/AuthGuard";

export default function preferencesController(server: Express): void {
    const router = Router();
    const preferencesService = new PreferencesService();

    server.use("/user/preferences", router);

    router.get("", authGuard, handleGetPreferences(preferencesService));
    router.post("/define", authGuard, handleDefinePreferences(preferencesService));
}

function handleGetPreferences(preferencesService: PreferencesService) {
    return async (request: Request, response: Response) => {
        const userId = request.userId!;
        const preferences = await preferencesService.findByUser(userId);
        response.status(200).json(preferences);
    };
}

function handleDefinePreferences(preferencesService: PreferencesService) {
    return async (request: Request, response: Response) => {
        const userId = request.userId!;
        const { typeId } = request.body;
        const dto = new PreferencesCreateDTO(userId, typeId);
        const preferences = await preferencesService.create(dto);
        response.status(201).json(preferences);
    };
}
