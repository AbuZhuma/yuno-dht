const { createRoom } = require("../db");
const { hashPassword } = require("../helpers");

const setRoom = async (req, res) => {
      try {
            const body = req.body
            if (!body.name) return res.status(400).send("The 'name' field is required.");
            if (!body.password) return res.status(400).send("The 'password' field is required.");
            const hashed = await hashPassword(body.password)
            body.password = hashed
            createRoom(body, (err, msg) => {
                  if (err) return res.status(400).send(msg);
                  res.status(200).send(msg)
            });
      } catch (error) {
            console.log("🛑 "+error+"\n");
      }
}

module.exports = setRoom      