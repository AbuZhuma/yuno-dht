const { deleteRoom } = require("../../db")
const { comparePassword, sendEmail } = require("../../helpers")
const Key = require("../../models/key")
const PlusRoom = require("../../models/plusroom")
const { generateStrongPassword } = require("../../shared/helpers")

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
                        deleteRoom(body.name, async(err, msg) => {
                              if (err) return res.status(400).send(msg);
                              const code = await generateStrongPassword(5);
                              const newKey = new Key({
                                    key: code,
                                    active: true,
                                    email: body.email
                              });
                              await newKey.save();

                              await sendEmail({
                                    email:body.email,
                                    code,
                                    subject: "Your creation key."
                              });
                              res.status(200).send(msg)
                        })
                  }
            } else {
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