const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteAllUserNotifications,
  deleteNotificationById
} = require('../controllers/notificationController');
const { isAuthenticated } = require('../middleWare/auth');


router.route('/notifications')
  .get(isAuthenticated, getUserNotifications);

router.route('/notifications/:id/read')
  .put(isAuthenticated, markAsRead);

router.route('/notifications/read-all')
  .put(isAuthenticated, markAllAsRead);
router.route('/notifications/:id')
  .delete(isAuthenticated, deleteNotificationById);
router.route('/notifications/delete-all')
  .delete(isAuthenticated, deleteAllUserNotifications);


module.exports = router;