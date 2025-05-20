const express = require('express');
const router = express.Router();
const unsetRoom = require('../controllers/room/deleteRoom');
const checkRoomAccess = require('../middlewares/checkRoomAccess');
const setRoom = require('../controllers/room/createRoom');
const { editRooms } = require('../controllers/room/editRoom');
const { getRoom } = require('../controllers/room/getRoom');

router.post("/", setRoom)
router.delete("/", checkRoomAccess, unsetRoom)
router.put("/", editRooms)
router.get("/:name", getRoom)
module.exports = router