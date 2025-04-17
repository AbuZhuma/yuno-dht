const { getRoom } = require("../db");
const { comparePassword } = require("../helpers");

const checkRoomAccess = async(req, res, next) => {
      try {
            const body = req.body
            if (!body.name) return res.status(400).send("Please enter the 'name' field.");
            if (!body.password) return res.status(400).send("Please enter the 'password' field.");
            getRoom(body.name, async(err, room) => {
                  if (err) return res.status(400).send(msg);
                  if(!room) return ws.send(JSON.stringify({type:"error", err:"Room not found."}))
                  const isPerm = await comparePassword(body.password, room.password)
                  if(!isPerm){
                        res.status(401).send("The password you entered is incorrect.")
                        return
                  }
                  next()
            })
      } catch (error) {
            console.log("🛑 "+error+"\n");
      }
}
module.exports = checkRoomAccess