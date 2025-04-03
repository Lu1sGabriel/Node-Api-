import { Router, Request, Response, Express } from "express";
import UserService from "../../../application/service/user/UserService";
import authGuard from "../../../infrastructure/middleware/AuthGuard";
import { UserUpdateDTO } from "../../dto/user/UserDTO";

export default function userController(server: Express): void {
    const router = Router();
    const userService = new UserService();

    server.use("/user", router);

    router.route("/")
        .get(authGuard, handleGetById(userService))
        .put(authGuard, handleUpdate(userService))
        .delete(authGuard, handleDelete(userService));
}

function handleGetById(userService: UserService) {
    return async (request: Request, response: Response) => {
        const id = request.userId!;
        const user = await userService.findById(id);
        response.status(200).json(user);
    };
}

function handleUpdate(userService: UserService) {
    return async (request: Request, response: Response) => {
        const id = request.userId!;
        const { name, email, password, avatar } = request.body;
        const updatedUser = await userService.update(id, new UserUpdateDTO(name, email, password, avatar));
        response.status(200).json(updatedUser);
    };
}

function handleDelete(userService: UserService) {
    return async (request: Request, response: Response) => {
        const id = request.userId!;
        await userService.delete(id);
        response.sendStatus(204);
    };
}