const express = require('express');
const Fb = require('../models/feadback');
const router = express.Router();

router.post("/", (req, res) => {
      if(!req.body.text || !req.body.email){
            res.status(400).json({message: "Please send text/email!"})
            return
      }
      const date = new Date()
      const opt = {
            text: req.body.text, 
            email: req.body.email,
            date: date
      }
      const newFb = new Fb(opt)
      newFb.save()
      res.status(200).json({message: "Feadback sended"})
})
router.get("/", async (req, res) => {
      const all = await Fb.find()
      res.status(200).json(all.reverse())
})
module.exports = router