const express = require("express");
const router = express.Router();

const messageControllers = require('../controllers/message.controller');
const protectRoute = require("../middleware/protectRoute");

router.post("/send", protectRoute, messageControllers.sendMessage);
router.get("/", protectRoute, messageControllers.getMessages);

module.exports = router;
