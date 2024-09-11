const express = require("express");
const router = express.Router();

const userControllers = require('../controllers/user.controller');
const protectRoute = require("../middleware/protectRoute");

router.post("/", userControllers.createUser);
router.get("/", protectRoute, userControllers.getUsers);

module.exports = router;
