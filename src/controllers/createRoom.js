const { createRoom } = require("../db");
const { hashPassword } = require("../helpers");

const setRoom = async (req, res) => {
      try {
            const body = req.body
            if (!body.name) return res.status(400).send("Please write name field!");
            if (!body.password) return res.status(400).send("Please write password field!");
            const hashed = await hashPassword(body.password)
            body.password = hashed
            createRoom(body, (err, msg) => {
                  if (err) return res.status(400).send(msg);
                  res.status(200).send(msg)
            });
      } catch (error) {
            console.log(error);
      }
}

module.exports = setRoom      