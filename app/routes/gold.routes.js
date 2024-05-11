// LIBRARY IMPORT
const router = require("express").Router()

// MIDDLEWARE IMPORT
const { authenticateToken } = require("../middleware/middleware")

// CONTROLLER IMPORT
const gold_controller = require("../controllers/gold.controller")

// ROUTER CONFIGURATION
router.post("/gold-management", authenticateToken, gold_controller.create);
router.get("/gold-management", authenticateToken, gold_controller.findAll);

module.exports = router