import { Express, Router, Request, Response } from "express";
import UserService from "../services/UserService";
import { UserCreateDTO, UserUpdateDTO } from "../dtos/UserDTO";

export default function UserController(server: Express): void {

    const router = Router();
    const userService = new UserService();

    server.use("/user", router);

    router.get("/:id", async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await userService.findById(id);

        res.status(200).json({ status: "success", data: user });
    });

    router.get("/email/:email", async (req: Request, res: Response) => {
        const { email } = req.params;
        const user = await userService.findByEmail(email);

        res.status(200).json({ status: "success", data: user });
    });

    router.post("/register", async (req: Request, res: Response) => {
        const { name, email, cpf, password, avatar } = req.body;
        const dto = new UserCreateDTO(name, email, cpf, password, avatar);

        const user = await userService.create(dto);
        res.status(201).json({ status: "success", data: user });
    });

    router.put("/:id", async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, email, password, avatar } = req.body;
        const dto = new UserUpdateDTO(name, email, password, avatar);

        const updatedUser = await userService.update(id, dto);
        res.status(200).json({ status: "success", data: updatedUser });
    });

    router.delete("/:id", async (req: Request, res: Response) => {
        const { id } = req.params;
        await userService.delete(id);

        res.status(204).json({ status: "success", message: "User deleted successfully" });
    });

}