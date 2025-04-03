import { Application, Router, Request, Response } from "express";
import AuthService from "../../../application/service/auth/AuthService";
import { UserCreateDTO } from "../../dto/user/UserDTO";
import { AuhtLoginDTO } from "../../dto/auth/AuthLoginDTO";

export default function authController(server: Application): void {
    const router = Router();
    const authService = new AuthService();

    server.use("/auth", router);

    router.post("/sign-in", handleSignIn(authService));
    router.post("/register", handleRegister(authService));
}

function handleSignIn(authService: AuthService) {
    return async (request: Request, response: Response) => {
        const { email, password } = request.body;
        const authData = await authService.login(new AuhtLoginDTO(email, password));
        response.status(200).json(authData);
    };
}

function handleRegister(authService: AuthService) {
    return async (request: Request, response: Response) => {
        const { name, email, cpf, password, avatar } = request.body;
        const dto = new UserCreateDTO(name, email, cpf, password, avatar);
        const user = await authService.register(dto);
        response.status(201).json(user);
    };
}