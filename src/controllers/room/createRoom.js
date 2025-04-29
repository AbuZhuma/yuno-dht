const { createRoom } = require("../../db");
const { hashPassword } = require("../../helpers");
const { generateStrongPassword } = require("../../shared/helpers");

const setRoom = async (req, res) => {
      try {
            const body = req.body
            if (!body.name) return res.status(400).send("The 'name' field is required.");
            const password = await generateStrongPassword()
            const pass = `${body.name}-${password}`
            const hashed = await hashPassword(pass)
            body.password = hashed
            createRoom(body, (err, msg) => {
                  if (err) return res.status(400).json({msg});
                  res.status(200).json({
                        room: body.name, 
                        password: pass
                  })
            });
      } catch (error) {
            console.log("🛑 "+error+"\n");
      }
}

module.exports = setRoom      