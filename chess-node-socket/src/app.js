import express from "express";
import path from "path";
import cors from "cors";
import http from "http";
import wsChess from "./ws-chess.js";

const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use("/api", (_req, res) => res.send({ text: "Hello World" }));

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Application started on port ${PORT}`));

wsChess(server);