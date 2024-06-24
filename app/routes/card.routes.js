// LIBRARY IMPORT
const router = require("express").Router()

// MIDDLEWARE IMPORT
const { authenticateToken } = require("../middleware/middleware")

// CONTROLLER IMPORT
const card_controller = require("../controllers/card.controller")

// ROUTER CONFIGURATION
router.post('/card-management', authenticateToken, card_controller.create);
router.get('/card-management', authenticateToken, card_controller.findAll)
router.get('/card-management/:uuid', authenticateToken, card_controller.findOne)
router.get('/card-management/user/:uuid', authenticateToken, card_controller.findUserCards)
router.delete('/card-management', authenticateToken, card_controller.deleteAll)

module.exports = router