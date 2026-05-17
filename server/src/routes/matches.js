const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.post('/like/:id', protect, matchController.likeUser);
router.get('/', protect, matchController.getMatches);

module.exports = router;