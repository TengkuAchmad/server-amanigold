// LIBRARY IMPORT
const router = require("express").Router()

// MIDDLEWARE IMPORT
const { authenticateToken } = require("../middleware/middleware")

// CONTROLLER IMPORT
const gold_controller = require("../controllers/gold.controller")

// ROUTER CONFIGURATION
router.get("/gold-management", authenticateToken, gold_controller.fetchDataGold);

module.exports = router