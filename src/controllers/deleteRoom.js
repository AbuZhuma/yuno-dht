const { deleteRoom } = require("../db")
const { comparePassword } = require("../helpers")

const unsetRoom = async (req, res) => {
      try {
            const body = req.body
            deleteRoom(body.name, (err, msg) => {
                  if (err) return res.status(400).send(msg);
                  res.status(200).send(msg)
            })
      } catch (error) {
            console.log(error);
      }
}
module.exports = unsetRoom