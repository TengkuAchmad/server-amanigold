// LIBRARY IMPORT
const router = require("express").Router()

// MIDDLEWARE IMPORT
const { authenticateToken } = require("../middleware/middleware")

const { upload }            = require("../middleware/middleware.multer")

// CONTROLLER IMPORT
const content_controller = require("../controllers/content.controller")

// ROUTER CONFIGURATION
router.post('/content-management', upload.any() , content_controller.uploadTest);

module.exports = router