// LIBRARY IMPORT
const router = require("express").Router()

// MIDDLEWARE IMPORT
const { authenticateToken } = require("../middleware/middleware")

// CONTROLLER IMPORT
const content_controller = require("../controllers/content.controller")

// ROUTER CONFIGURATION
router.post('/content-management', authenticateToken, content_controller.upload);

module.exports = router