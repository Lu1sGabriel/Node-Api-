import "dotenv/config";
import express, { json } from "express";
import cors from "cors";

import UserController from "./controllers/UserController";
import PreferencesController from "./controllers/PreferencesController";

const server = express();

server.use(express.json());
server.use(json());
server.use(cors());

UserController(server);
PreferencesController(server);

const port = process.env.PORT;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});