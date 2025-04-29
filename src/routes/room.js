const express = require('express');
const router = express.Router();
const unsetRoom = require('../controllers/room/deleteRoom');
const checkRoomAccess = require('../middlewares/checkRoomAccess');
const setRoom = require('../controllers/room/createRoom');

router.post("/", setRoom)
router.delete("/", checkRoomAccess, unsetRoom)

module.exports = router