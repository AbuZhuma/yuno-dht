const New = require("../../models/news");

const deleteNews = async(req, res) => {
      try {
            const body = req.body
            if(!body.version) return res.status(400).json({message:"Please send version!"})
            await New.findOneAndDelete({version: body.version})
            res.status(200).json("Deleted!")
      } catch (error) {
            console.log(error);
      }
}
module.exports = deleteNews