// LIBRARY IMPORT
const router = require("express").Router()

// CONTROLLER IMPORT
const api_controller = require("../controllers/api.controller")

// ROUTER CONFIGURATION
router.get("/test", api_controller.test)

module.exports = router