const { createRoom } = require("../../db");
const { hashPassword } = require("../../helpers");
const PlusRoom = require("../../models/plusroom");
const { generateStrongPassword } = require("../../shared/helpers");

const setRoom = async (req, res) => {
  try {
    const body = req.body;

    if (!body.name) {
      return res.status(400).json({ 
        error: "Field 'name' required." 
      });
    }
    if(!body.status){
      body.status = "private"
    }
    if(!body.plan){
      body.plan="basic"
    }
    if (body.plan !== "basic" && body.plan !== "plus") {
      return res.status(400).json({ 
        error: "Field 'plan' most be 'basic' or 'plus'." 
      });
    }

    const password = await generateStrongPassword();
    const pass = `${body.name}-${password}`;
    const hashed = await hashPassword(pass);
    body.password = hashed;

    
    createRoom(body, async (err, msg) => {
      if (err) {
        return res.status(400).json({ error: "Error create." });
      }

      if (body.plan === "plus") {
        try {
          const plusRoom = new PlusRoom({
            name: body.name,
            description: body.description || "",
            online: body.online || 0,
            language: body.language || "en",
            author: body.author || "unknown",
            company: body.company || "",
            tags: body.tags || [],
            technologies: body.technologies || [],
          });

          await plusRoom.save(); 
          console.log("PlusRoom created:", plusRoom.name);

        } catch (mongooseError) {
          console.error("Error with create PlusRoom:", mongooseError.message);
        }
      }

      res.status(200).json({
        room: body.name,
        password: pass, 
        plan: body.plan,
      });
    });

  } catch (error) {
    console.log(error);
    
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = setRoom;