// LIBRARY IMPORT
const router = require("express").Router()

// MIDDLEWARE IMPORT
const { authenticateToken } = require("../middleware/middleware")

const { uploadMiddleware }  = require("../middleware/middleware.multer")

// CONTROLLER IMPORT
const content_controller = require("../controllers/content.controller")

// ROUTER CONFIGURATION
router.post('/content-management', uploadMiddleware.any() , content_controller.upload);

module.exports = router