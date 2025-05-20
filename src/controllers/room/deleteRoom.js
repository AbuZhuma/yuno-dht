const { deleteRoom } = require("../../db")
const { comparePassword } = require("../../helpers")
const PlusRoom = require("../../models/plusroom")

const unsetRoom = async (req, res) => {
      try {
            const body = req.body
            if (!body.name) {
                  return
            }
            const isExist = await PlusRoom.findOne({ name: body.name })
            if (isExist && body.auth_password) {
                  const compare = await comparePassword(body.auth_password, isExist.password)
                  if (compare) {
                        await PlusRoom.findOneAndDelete({ name: body.name })
                        deleteRoom(body.name,(err, msg) => {
                              if (err) return res.status(400).send(msg);
                              res.status(200).send(msg)
                        })
                  }
            }else{
                  deleteRoom(body.name, (err, msg) => {
                        if (err) return res.status(400).send(msg);
                        res.status(200).send(msg)
                  })
            }

      } catch (error) {
            res.status(500).json({ error: "Server error." });

            console.log("🛑 " + error + "\n");
      }
}
module.exports = unsetRoom