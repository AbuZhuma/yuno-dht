const { comparePassword } = require("../../helpers")
const PlusRoom = require("../../models/plusroom")

const editRooms = async(req, res) => {
      try {
            const body = req.body
            if (!body.name || !body.changes || !body.password) {
                  return res.status(404).json({ error: "Check fields." });
            }
            const isExist = await PlusRoom.findOne({ name: body.name })
            if (isExist && body.password) {
                  const compare = await comparePassword(body.password, isExist.password)
                  if (compare) {
                        await PlusRoom.findOneAndUpdate({ name: body.name }, body.changes)
                        return res.status(200).send("Good job")
                  }else{
                    return res.status(401).send("Wrong password")    
                  }
            }
            res.status(404).send("Not good")
      } catch (error) {
            res.status(500).json({ error: "Server error." });
            console.log("🛑 " + error + "\n");
      }
}
module.exports = {editRooms}