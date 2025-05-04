const { getAllPubRoom } = require("../db");
const PlusRoom = require("../models/plusroom");

const webClient = async ({ ws, message, wss }) => {
  const body = JSON.parse(message);
  switch (body.type) {
    case "public_rooms":
      getAllPubRoom(async (err, rooms) => {
        if (err) return console.log(err);
        
        try {
          const mgRooms = await PlusRoom.find();
          
          const roomUsersMap = new Map();
          rooms.forEach(room => {
            roomUsersMap.set(room.name, room.users?.length || 0);
          });
          
          const final = mgRooms.map(room => ({
            ...room.toObject(),
            online: roomUsersMap.get(room.name) || 0 
          }));
          
          ws.send(JSON.stringify({ type: "public_rooms", final }));
        } catch (error) {
          console.error("Error fetching rooms:", error);
        }
      });
      break;
    default:
      break;
  }
};

module.exports = webClient;