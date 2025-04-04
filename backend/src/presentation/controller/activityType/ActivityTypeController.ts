import { Router, Request, Response, Express } from "express";
import ActivityTypeService from "../../../application/service/activityType/ActivityTypeService";
import authGuard from "../../../infrastructure/middleware/AuthGuard";
import { ActivityTypeCreateDTO } from "../../dto/activityType/ActivityTypeDTO";

export default function activityTypeController(server: Express): void {
    const router = Router();
    const activityTypeService = new ActivityTypeService();

    server.use("/activities", router);

    router.get("/types", authGuard, handleFindAll(activityTypeService));

    router.route("/")
        .post(authGuard, handleCreate(activityTypeService));

    function handleFindAll(activityTypeService: ActivityTypeService) {
        return async (request: Request, response: Response) => {
            const activityTypes = await activityTypeService.findAll();
            response.status(200).json(activityTypes);
        };
    }

    function handleCreate(activityTypeService: ActivityTypeService) {
        return async (request: Request, response: Response) => {
            const { name, description, image } = request.body;
            const newActivityType = await activityTypeService.create(new ActivityTypeCreateDTO(name, description, image));
            response.status(201).json(newActivityType);
        };
    }

} 
