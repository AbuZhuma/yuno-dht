const WebSocket = require('ws');
const { comparePassword } = require('../helpers');
const { sendRoomatesList, updateUser, notifyNewUser } = require('../websocket/funcs');
const { getRoom, removeUser } = require('../db');

const wssinit = (server) => {
      const wss = new WebSocket.Server({ server });
      wss.on('connection', (ws) => {
            ws.on('message', (message) => {
                  try {
                        const { type, configs } = JSON.parse(message.toString());
                        ws.user_id = configs.user_id
                        ws.room = configs.room
                        const requiredFields = ['room', 'user_id', 'password'];

                        for (const field of requiredFields) {
                              if (!configs[field]) {
                                    return ws.send(JSON.stringify({
                                          type: "err",
                                          err: `The '${field}' field is missing from the Yuno configuration.`
                                    }));
                              }
                        }

                        getRoom(configs.room, async (err, room) => {
                              ws.status = room.status
                              if (err) {
                                    return ws.send(JSON.stringify({ type: "err", err: err.message }));
                              }
                              if (!room) return ws.send(JSON.stringify({ type: "error", err: "Room not found" }))
                              const isPerm = await comparePassword(configs.password, room.password);
                              if (!isPerm) {
                                    if (room.status === "public") {                                          
                                          switch (type) {
                                                case "get_roomates":
                                                      if (!configs.ip) {
                                                            return ws.send(JSON.stringify({
                                                                  type: "err-roomates",
                                                                  err: "IP address is required in the Yuno config. Please provide it."
                                                            }));
                                                      }
                                                      await updateUser({...configs, status: room.status});
                                                      notifyNewUser(wss, configs, ws, room.status);
                                                      break;
                                                default:
                                                      break;
                                          }
                                          ws.send(JSON.stringify({ type: "free" }));
                                    } else {
                                          ws.send(JSON.stringify({
                                                type: "err-password",
                                                err: "The password you entered is incorrect."
                                          }));
                                    }
                              } else {
                                    switch (type) {
                                          case "get_roomates":
                                                if (!configs.ip) {
                                                      return ws.send(JSON.stringify({
                                                            type: "err-roomates",
                                                            err: "IP address is required in the Yuno config. Please provide it."
                                                      }));
                                                }
                                                if (isPerm) {
                                                      await updateUser({...configs, status: room.status});
                                                      sendRoomatesList(ws, configs);
                                                      notifyNewUser(wss, configs, ws);
                                                }
                                                break;
                                          default:
                                                break;
                                    }
                              }

                        });
                  } catch (err) {
                        ws.send(JSON.stringify({
                              type: "err",
                              err: "Invalid message format"
                        }));
                  }
            });
            ws.on('close', () => {
                  removeUser(ws.user_id, (err, msg) => {
                  })
            });
      });
      return wss
}
module.exports = wssinit