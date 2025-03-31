import "dotenv/config";
import "express-async-errors";
import express from "express";
import cors from "cors";

import UserController from "./presentation/controller/user/UserController";
import PreferencesController from "./presentation/controller/preference/PreferenceController";
import middlewareError from "./infrastructure/middleware/Error";

const server = express();

server.use(express.json());
server.use(cors());

UserController(server);
PreferencesController(server);

server.use(middlewareError);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
