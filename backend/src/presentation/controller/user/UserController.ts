import { Router, Request, Response, Express } from "express";
import UserService from "../../../application/service/user/UserService";
import authGuard from "../../../infrastructure/middleware/AuthGuard";
import { UserUpdateDTO } from "../../dto/user/UserDTO";

export default function UserController(server: Express): void {
    const router = Router();
    const userService = new UserService();

    server.use("/user", router);

    router.get("", authGuard, handleGetById(userService))
    router.put("/update", authGuard, handleUpdate(userService));
    router.put("/avatar", authGuard, handleAvatarUpdate(userService));
    router.delete("/deactivate", authGuard, handleDelete(userService));

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
        const { name, email, password } = request.body;
        const updatedUser = await userService.update(id, new UserUpdateDTO(name, email, password));
        response.status(200).json(updatedUser);
    };
}

function handleAvatarUpdate(userService: UserService) {
    return async (request: Request, response: Response) => {
        const id = request.userId!;
        const { avatar } = request.body;
        const updatedUser = await userService.update(id, new UserUpdateDTO(avatar));
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