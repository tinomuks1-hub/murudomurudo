const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.post('/:id', protect, messageController.sendMessage);
router.get('/:id', protect, messageController.getMessages);

module.exports = router;