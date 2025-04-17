const http = require('http');
const express = require("express");
const room = require("./routes/room")
const wssinit = require('./websocket/wss');
const cors = require("cors")
const { default: helmet } = require('helmet');
require("dotenv").config()

const app = express()
const server = http.createServer(app);
const PORT = process.env.PORT

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use("/room", room)

const wss = wssinit(server)

server.listen(PORT, () => {
  console.log('🚀 Server running on '+PORT+" port");
});

process.on('SIGINT', () => {
  server.close();
  process.exit();
});