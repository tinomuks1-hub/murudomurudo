const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

console.log('userController:', userController);
console.log('authMiddleware:', authMiddleware);

router.get('/profile', authMiddleware.protect, userController.getProfile);
router.put('/profile', authMiddleware.protect, userController.updateProfile);
router.get('/discover', authMiddleware.protect, userController.getUsers);

module.exports = router;