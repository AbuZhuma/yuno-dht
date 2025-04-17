const express = require('express');
const router = express.Router();
const unsetRoom = require('../controllers/deleteRoom');
const checkRoomAccess = require('../middlewares/checkRoomAccess');
const {getRoom} = require('../db');
const setRoom = require('../controllers/createRoom');

router.post("/", setRoom)
router.delete("/", checkRoomAccess, unsetRoom)
router.get("/:room", (req, res) => {
  getRoom(req.params.room, (err, room) => {
    res.status(200).json(room)
  })
})
module.exports = router