import "dotenv/config";
import express, { json } from "express";
import cors from "cors";


const server = express();

server.use(json());
server.use(cors());

const port = process.env.PORT;
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});