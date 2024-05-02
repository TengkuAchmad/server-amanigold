// LIBRARY IMPORT
const router = require("express").Router()

// MIDDLEWARE IMPORT
const authenticateToken = require("../middleware/middleware")

// CONTROLLER IMPORT
const user_controller = require("../controllers/user.controller")

// ROUTER CONFIGURATION
router.get("/user-management", authenticateToken, user_controller.findOne);
router.post("/user-management/auth", user_controller.auth);
router.post("/user-management", user_controller.signup);
router.delete("/user-management", user_controller.deleteAll);

module.exports = router