const Notification = require('../models/notificationModel');
const catchAsyncError = require('../middleWare/asyncErrors');
// Get user's notifications
exports.getUserNotifications = catchAsyncError(async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Default: 10 per page

  const notifications = await Notification.find({ recipients: { $in: [req.user._id] } })
    .sort({ createdAt: -1 })
    // .limit(limit * 1)
    // .skip((page - 1) * limit)
    .populate('relatedId');

  const total = await Notification.countDocuments({ recipients: { $in: [req.user._id] } });

  res.status(200).json({
    success: true,
    notifications,
    totalPages: Math.ceil(total / limit),
    currentPage: page
  });
});

exports.markNotificationsAsRead = catchAsyncError(async (req, res) => {
  const { notificationIds } = req.body; // Array of notification IDs

  if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid notification IDs" });
  }

  await Notification.updateMany(
    { 
      _id: { $in: notificationIds }, 
      recipients: { $in: [req.user._id] } // Ensure user is a recipient
    },
    { $addToSet: { readBy: req.user._id } } // Prevent duplicate entries
  );

  res.status(200).json({
    success: true,
    message: "Notifications marked as read successfully"
  });

});
exports.deleteNotificationById = catchAsyncError(async (req, res) => {
  const { id } = req.params;

  const notification = await Notification.findById(id);

  if (!notification) {
    return res.status(404).json({ success: false, message: "Notification not found" });
  }

  // Ensure user is a recipient
  if (!notification.recipients.includes(req.user._id)) {
    return res.status(403).json({ success: false, message: "Not authorized to delete this notification" });
  }

  // Remove user from recipients
  notification.recipients = notification.recipients.filter(userId => userId.toString() !== req.user._id.toString());

  // If no recipients left, delete notification
  if (notification.recipients.length === 0) {
    await Notification.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Notification deleted permanently" });
  }

  // Save updated notification
  await notification.save();

  res.status(200).json({ success: true, message: "User removed from notification recipients" });
});

exports.deleteAllUserNotifications = catchAsyncError(async (req, res) => {
  const userId = req.user._id;

  // Step 1: Remove user from all notifications where they are a recipient
  await Notification.updateMany(
    { recipients: { $in: [userId] } },
    { $pull: { recipients: userId } }
  );

  // Step 2: Delete notifications where recipients array is empty
  await Notification.deleteMany({ recipients: { $size: 0 } });

  res.status(200).json({
    success: true,
    message: "All user notifications removed successfully"
  });
});


// exports.getUserNotifications = catchAsyncError(async (req, res) => {
//   const notifications = await Notification.find({
//     recipients: req.user._id
//   })
//     .sort({ createdAt: -1 })
//     .populate('sender')
//     .populate('relatedId');

//   res.status(200).json({
//     success: true,
//     notifications
//   });
// });


// Mark notification as read
// exports.markAsRead = catchAsyncError(async (req, res) => {
//   await Notification.findByIdAndUpdate(req.params.id, {
//     read: true
//   });

//   res.status(200).json({
//     success: true
//   });
// });

exports.markAsRead = catchAsyncError(async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, {
    $addToSet: { readBy: req.user._id }
  });

  res.status(200).json({
    success: true
  });
});





// Mark all notifications as read
exports.markAllAsRead = catchAsyncError(async (req, res) => {
  await Notification.updateMany(
    { recipients: req.user._id },
    { $addToSet: { readBy: req.user._id } }
  );

  res.status(200).json({
    success: true
  });
});
