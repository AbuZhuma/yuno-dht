const express = require('express');
const createNews = require('../controllers/news/createNews');
const New = require('../models/news');
const deleteNews = require('../controllers/news/deleteNews');
const router = express.Router();

router.post("/", createNews)
router.delete("/", deleteNews)
router.get("/:sort", async (req, res) => {
      const sortType = req.params.sort
      let news = await New.find().sort({
            "version.0": -1,
            "version.1": -1,
            "version.2": -1
      });
      if(sortType === "all"){
            return res.status(200).json(news)  
      }
      if (sortType) {
            let exists = [];
            news = news.reverse().filter((el) => {
                  let key;
                  if (sortType === 'major') {
                        key = el.version[0].toString();
                  } else if (sortType === 'minor') {
                        key = `${el.version[0]}.${el.version[1]}`;
                  } else if (sortType === 'patch') {
                        key = `${el.version[0]}.${el.version[1]}.${el.version[2]}`;
                  }

                  if (!exists.includes(key)) {
                        exists.push(key);
                        return true;
                  }
                  return false;
            });
      }
      res.status(200).json(news.reverse())

})
module.exports = router