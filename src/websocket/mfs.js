const { comparePassword } = require('../helpers');
const { sendRoomatesList, updateUser, notifyNewUser } = require('../websocket/funcs');
const { getRoom, removeUser } = require('../db');
const PlusRoom = require('../models/plusroom');

const mfsCLient = async ({ message, ws, wss }) => {
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
                  if (err) {
                        return ws.send(JSON.stringify({ type: "err", err: err.message }));
                  }
                  if (!room) return ws.send(JSON.stringify({ type: "error", err: "Room not found" }))
                  const isExist = await PlusRoom.findOne({ name: configs.room })
                  if (isExist) {
                        ws.send(JSON.stringify({ type: "settings", settings: isExist.settings }))
                  }
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
                                          await updateUser({ ...configs, status: "viewer" });
                                          ws.isViewer = true
                                          notifyNewUser(wss, configs, ws);
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
                                          ws.isViewer = false
                                          await updateUser({ ...configs, status: "member" });
                                          sendRoomatesList(ws, configs);
                                          notifyNewUser(wss, configs, ws);
                                    }
                                    break;
                              default:
                                    break;
                        }
                  }
            });
            ws.on("close", () => {
                  removeUser(ws.user_id, (err, msg) => {
                        if (err) console.log(err)
                  })
            })
      } catch (err) {
            ws.send(JSON.stringify({
                  type: "err",
                  err: "Invalid message format"
            }));
      }
}
module.exports = mfsCLient