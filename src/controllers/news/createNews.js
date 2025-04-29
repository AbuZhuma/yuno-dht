const New = require("../../models/news");

const createNews = async (req, res) => {
      try {
            const body = req.body
            if (!body.title || !body.version || !body.date || !body.author || !body.description || !body.changelog) {
                  return res.status(400).json({ message: "Please check you`r fields!" })
            }
            const newNews = new New(body)
            newNews.save()
            res.status(200).json({ message: "New created!" })
      } catch (error) {
            console.log(error);
      }
}
module.exports = createNews