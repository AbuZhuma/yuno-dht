const http = require('http');
const WebSocket = require('ws');
const { createRoom, addUser, getRoom, getRoomUsers, removeUser } = require('./db');
const setRoom = require('./controllers/createRoom');
const express = require("express");
const unsetRoom = require('./controllers/deleteRoom');
const checkRoomAccess = require('./middlewares/checkRoomAccess');
const { comparePassword } = require('./helpers');

const app = express()
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

app.post("/room", setRoom)
app.delete("/room", checkRoomAccess, unsetRoom)
app.get("/room/:room", (req, res) => {
  getRoom(req.params.room, (err, room) => {
    res.status(200).json(room)
  })
})

wss.on('connection', (ws) => {
  console.log(`New connection`);

  ws.on('message', (message) => {
    try {
      const { type, configs } = JSON.parse(message.toString());
      ws.user_id = configs.user_id
      const requiredFields = ['room', 'user_id', 'password'];
      for (const field of requiredFields) {
        if (!configs[field]) {
          return ws.send(JSON.stringify({
            type: "err",
            err: `Yuno config dont have ${field} field!`
          }));
        }
      }
  
      getRoom(configs.room, async (err, room) => {
        if (err) {
          return ws.send(JSON.stringify({ type: "err", err: err.message }));
        }
        if(!room) return ws.send(JSON.stringify({type:"error", err:"Room not found"}))
        const isPerm = await comparePassword(configs.password, room.password);
        if (!isPerm) {
          return ws.send(JSON.stringify({ 
            type: "err", 
            err: "Wrong password" 
          }));
        }
        switch (type) {
          case "get_roomates":
            if (!configs.ip) {
              return ws.send(JSON.stringify({
                type: "err",
                err: "Please send ip!"
              }));
            }
    
            await updateUser(configs);
            sendRoomatesList(ws, configs);
            notifyNewUser(wss, configs);
            break;
          default:
            break;
        }
      });
    } catch (err) {
      ws.send(JSON.stringify({
        type: "err",
        err: "Invalid message format"
      }));
    }
  });
  async function updateUser(configs) {
    return new Promise((resolve, reject) => {
      removeUser(configs.user_id, (err, msg) => {
        if (err) return reject(err);
        addUser({
          id: configs.user_id,
          room_id: configs.room,
          ip: configs.ip
        }, (err, msg) => {
          if (err) return reject(err);
          console.log(msg);
          resolve();
        });
      });
    });
  }
  
  function sendRoomatesList(ws, configs) {
    getRoomUsers(configs.room, (err, users) => {
      if (err) {
        return ws.send(JSON.stringify({ type: "err", err: err.message }));
      }
      
      const filteredUsers = users.filter(el => el.id !== configs.user_id);
      ws.send(JSON.stringify({
        type: "roomates",
        users: filteredUsers
      }));
    });
  }
  
  function notifyNewUser(wss, configs) {
    const newUserMsg = JSON.stringify({
      type: "new_user",
      user: {
        id: configs.user_id,
        room_id: configs.room,
        ip: configs.ip
      }
    });
  
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN && client !== ws) {
        client.send(newUserMsg);
      }
    });
  }

  ws.on('close', () => {
    removeUser(ws.user_id, (err, msg) => {
      console.log(err, msg);
    })
    console.log(`Client disconnected`);
  });
});
server.listen(4040, () => {
  console.log('Server running');
});

process.on('SIGINT', () => {
  db.close();
  server.close();
  process.exit();
});