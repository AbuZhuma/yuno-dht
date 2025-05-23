const { createRoom } = require("../../db");
const { hashPassword, sendEmail } = require("../../helpers");
const Key = require("../../models/key");
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
    if (!body.key && body.plan === "plus") {
      return res.status(400).json({ 
        error: "Field 'key' required." 
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
    if (!body.email && body.plan === "plus") {
      return res.status(400).json({ 
        error: "Field 'email' required." 
      });
    }
    const isKey = await Key.findOne({key: body.key})
    if(!isKey && body.plan === "plus"){
      return res.status(400).json({ 
        error: "Key not found!" 
      });
    }
    const password = await generateStrongPassword();
    const password2 = await generateStrongPassword();
    const pass = `${body.name}-${password}`;
    const authorPass = `${body.name}-author-${password2}`;
    const hashed = await hashPassword(pass);
    const authHashed = await hashPassword(authorPass)
    body.password = hashed;
    body.authorpassword = authHashed
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
            password: authHashed,
            settings: ["d", "c"]
          });
          await Key.findOneAndDelete({key: body.key})
          await plusRoom.save(); 
          await sendEmail({
            email: body.email,
            subject: `Your Access Credentials ${body.name}`,
            code: `
              Hello,  
              Room access passwords: 
              Main Password: ${pass}  
              Author Password: ${authorPass}  
            `
          });          
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