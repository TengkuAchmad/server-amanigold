// LIBRARY IMPORT
const router = require("express").Router()

// MIDDLEWARE IMPORT
const { authenticateToken } = require("../middleware/middleware")

// CONTROLLER IMPORT
const content_controller = require("../controllers/content.controller")

// ROUTER CONFIGURATION
router.post('/content-management', authenticateToken, content_controller.upload);
router.get('/content-management', authenticateToken, content_controller.findAll)
router.get('/content-management/:uuid', authenticateToken, content_controller.findOne)
router.delete('/content-management/:uuid', authenticateToken, content_controller.deleteOne)
router.delete('/content-management', authenticateToken, content_controller.deleteAll)

module.exports = router