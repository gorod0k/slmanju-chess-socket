// using const modules = require('module') instead of import module from "module"
const express = require('express')
const path = require("path")
//const cors = require( "cors")
const http = require( "http")
//const wsChess = require( "./ws-chess.js")

//const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// NEED??? app.use(cors());

app.use('/public', express.static(path.join(__dirname, 'public')));

app.use("/api", (_req, res) => res.send({ text: "Hello World" }));

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Application started on port ${PORT}`));

//—————————————————————————
//wsChess(server);

/* ws-chess js */
var Server = require('socket.io').Server;
//import { Server } from "socket.io";
//import { v4 as uuidv4 } from "uuid";

let socketIO = null;
const players = [];

const findPlayer = (name) => players.find((player) => player.username === name);

const onUserConnected = (socket) => (data) =>
{
  players.push({ username: data.userName, socketId: socket.id });

  socketIO.emit("players", players);
};

const onChallenge = (data) =>
{
  const challenger = findPlayer(data.from);
  const challengee = findPlayer(data.to);
  const message = {
    gameId: uuidv4(),
    white: challenger.username,
    player1: challenger.username,
    player2: challengee.username,
  };
  socketIO.to(challenger.socketId).emit("gameStart", message);
  socketIO.to(challengee.socketId).emit("gameStart", message);
};

const onMove = (data) => {
  const player = findPlayer(data.to);
  socketIO.to(player.socketId).emit("move", data.fen);
};

const onConnect = (socket) => {
  socket.on("userConnected", onUserConnected(socket));

  socket.on("challenge", onChallenge);

  socket.on("move", onMove);
};

const wsChess = (server) => {
  socketIO = new Server(server);

  socketIO.on("connection", onConnect);
};
