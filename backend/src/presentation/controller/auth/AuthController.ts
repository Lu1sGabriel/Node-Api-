import { Application, Router, Request, Response } from "express";
import AuthService from "../../../application/service/auth/AuthService";
import { UserCreateDTO } from "../../dto/user/UserDTO";

export default function authController(server: Application): void {
    const router = Router();
    const authService = new AuthService();

    server.use("/auth", router);

    router.post("/sign-in", handleSignIn(authService));
    router.post("/register", handleRegister(authService));
}

function handleSignIn(authService: AuthService) {
    return async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const authData = await authService.login(email, password);
        res.status(200).json(authData);
    };
}

function handleRegister(authService: AuthService) {
    return async (req: Request, res: Response) => {
        const { name, email, cpf, password, avatar } = req.body;
        const dto = new UserCreateDTO(name, email, cpf, password, avatar);
        const user = await authService.register(dto);
        res.status(201).json(user);
    };
}