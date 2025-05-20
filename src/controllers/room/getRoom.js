const PlusRoom = require("../../models/plusroom");

const getRoom = async (req, res) => {
      try {
            const name = req.params.name
            const room = await PlusRoom.findOne({ name: name })
            if (!room) {
                  return res.status(404).json({ error: "Room not found" });
            }
            res.status(200).json(room)
      } catch (error) {
            console.log(error);
            res.status(500).json({ error: "Server error." });
      }
}
module.exports = { getRoom }