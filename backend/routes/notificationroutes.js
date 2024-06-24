const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authenticate = require('../middleware/authmiddleware');

// Get all notifications for the logged-in user
router.get('/mynotifications', authenticate, notificationController.getMyNotifications);

// Delete a notification by ID
router.delete('/:notificationId', authenticate, notificationController.deleteNotification);

module.exports = router;
