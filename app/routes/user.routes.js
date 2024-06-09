// LIBRARY IMPORT
const router = require("express").Router()

// MIDDLEWARE IMPORT
const { authenticateToken } = require("../middleware/middleware")

// CONTROLLER IMPORT
const user_controller = require("../controllers/user.controller")

// ROUTER CONFIGURATION
router.get("/user-management", authenticateToken, user_controller.findOne);
router.get("/user-management/all", authenticateToken, user_controller.findAll);
router.put("/user-management/:uuid", authenticateToken, user_controller.update);
router.delete("/user-management/:uuid", authenticateToken,user_controller.deleteOne);
router.delete("/user-management", authenticateToken,user_controller.deleteAll);
// router.get("/user-management/google", user_controller.googleLogin);
// router.get("/user-management/facebook", user_controller.facebookLogin);
// router.get("/user-management/callback", user_controller.callback);
router.post("/user-management/auth", user_controller.auth);
router.post("/user-management", user_controller.signup);
module.exports = router