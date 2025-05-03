const { getRoomUsers, removeUser, addUser } = require("../db");
const WebSocket = require('ws');

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
async function updateUser(configs) {
      return new Promise((resolve, reject) => {
            removeUser(configs.user_id, (err, msg) => {
                  if (err) return reject(err);
                  addUser({
                        id: configs.user_id,
                        room_id: configs.room,
                        ip: configs.ip,
                        status: configs.status
                  }, (err, msg) => {
                        if (err) return reject(err);
                        resolve();
                  });
            });
      });
}

function notifyNewUser(wss, configs, ws, status) {
      const newUserMsg = JSON.stringify({
            type: "new_user",
            user: {
                  id: configs.user_id,
                  room_id: configs.room,
                  ip: configs.ip
            }
      });
      if (status === "public") {
            wss.clients.forEach(client => {
                  if (client.readyState === WebSocket.OPEN && client !== ws && ws.room === client.room) {
                        client.send(newUserMsg);
                  }
            });
      } else {
            wss.clients.forEach(client => {
                  if (client.readyState === WebSocket.OPEN && client !== ws && ws.room === client.room && client.status !== "public") {
                        client.send(newUserMsg);
                  }
            });
      }

}

module.exports = { sendRoomatesList, updateUser, notifyNewUser }