// import User from "../models/user.model.js";
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleWare/asyncErrors");
const Message = require("../models/messageModel.js");
const User = require("../models/userModel.js");
const { userSocketMap, getSocketIO } = require("../utils/socket.js");
const { sendNotification } = require("../utils/notification.js");
// const { sendNotification } = require("web-push");

// import cloudinary from "../lib/cloudinary.js";
// import { getReceiverSocketId, io } from "../lib/socket.js";


// exports.getUsersForSidebar = catchAsyncError(async (req, res) => {
//   const loggedInUserId = req.user.id;
//   const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

//   if (!filteredUsers) {
//     return next(new ErrorHandler("Users not found", 404));
//   }
//   res.status(200).json({
//     success: true,
//     users: filteredUsers,
//   });
// })


exports.getUsersForSidebar = catchAsyncError(async (req, res) => {
  const loggedInUserId = req.user.id;

  // Get all users except the logged-in user
  const users = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

  if (!users) {
    return next(new ErrorHandler("Users not found", 404));
  }

  // Fetch last message for each user and count unseen messages
  const usersWithLastMessage = await Promise.all(
    users.map(async (user) => {
      const lastMessage = await Message.findOne({
        $or: [
          { senderId: loggedInUserId, receiverId: user._id },
          { senderId: user._id, receiverId: loggedInUserId },
        ],
      })
        .sort({ createdAt: -1 }) // Sort by latest message
        .lean();

      const unseenMessagesCount = await Message.countDocuments({
        senderId: user._id,
        receiverId: loggedInUserId,
        seen: false, // Count only unseen messages
      });

      return {
        ...user.toObject(),
        lastMessage,
        unseenMessagesCount,
      };
    })
  );

  // Sort users based on last message timestamp
  usersWithLastMessage.sort((a, b) => {
    if (!a.lastMessage && !b.lastMessage) return 0;
    if (!a.lastMessage) return 1;
    if (!b.lastMessage) return -1;
    return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
  });

  res.status(200).json({
    success: true,
    users: usersWithLastMessage,
  });
});

exports.adminGetChatUsers = catchAsyncError(async (req, res, next) => {
  if (req.user.role !== "admin") {
    return next(new ErrorHandler("Access denied! Admins only.", 403));
  }

  const chatUsers = await Message.aggregate([
    {
      $group: {
        _id: {
          senderId: { $min: ["$senderId", "$receiverId"] }, // Always store smaller ID first
          receiverId: { $max: ["$senderId", "$receiverId"] } // Store larger ID second
        },
        lastMessage: { $last: "$$ROOT" }
      }
    },
    { $sort: { "lastMessage.createdAt": -1 } }
  ]);

  if (!chatUsers.length) {
    return next(new ErrorHandler("No chats found", 404));
  }

  // Get unique user IDs
  let userIds = new Set();
  chatUsers.forEach(chat => {
    userIds.add(chat._id.senderId.toString());
    userIds.add(chat._id.receiverId.toString());
  });

  // Fetch user details
  const users = await User.find({ _id: { $in: [...userIds] } }).select("userName userEmail role ");

  // Format response
  const formattedChatUsers = chatUsers.map(chat => ({
    user1: users.find(user => user._id.toString() === chat._id.senderId.toString()),
    user2: users.find(user => user._id.toString() === chat._id.receiverId.toString()),
    lastMessage: chat.lastMessage.text,
    lastMessageTime: chat.lastMessage.createdAt
  }));

  res.status(200).json({
    success: true,
    chatUsers: formattedChatUsers
  });
});

// exports.getMessages = catchAsyncError(async (req, res, next) => {

//   const { id: userToChatId } = req.params;
//   const myId = req.user._id;

//   const messages = await Message.find({
//     $or: [
//       { senderId: myId, receiverId: userToChatId },
//       { senderId: userToChatId, receiverId: myId },
//     ],
//   });


//   if (!messages) {
//     return next(new ErrorHandler("Message Can not be Sent", 400));
//   }
//   res.status(200).json({
//     success: true,
//     messages,
//   });


// });


exports.getMessages = catchAsyncError(async (req, res, next) => {
  const { id: userToChatId } = req.params;
  const myId = req.user._id;

  const messages = await Message.find({
    $or: [
      { senderId: myId, receiverId: userToChatId },
      { senderId: userToChatId, receiverId: myId },
    ],
  });

  if (!messages) {
    return next(new ErrorHandler("Message not found", 400));
  }

  // Mark unseen messages as seen
  await Message.updateMany(
    { senderId: userToChatId, receiverId: myId, seen: false },
    { $set: { seen: true } }
  );

  res.status(200).json({
    success: true,
    messages,
  });
});

exports.sendMessage = catchAsyncError(async (req, res, next) => {
  const { receiverId, text } = req.body;
  const senderId = req.user._id;

  let fileData = undefined;

  if (req.file) {
    fileData = {
      src: req.file.key,
      name: req.file.originalname,
      size: [req.file.size],
      type: req.file.mimetype,
    };
  }

  const newMessage = new Message({
    senderId,
    receiverId,
    text,
    fileData,
  });

  await newMessage.save();

  if (!newMessage) {
    return next(new ErrorHandler("Message Can not be Sent", 400));
  }
  // Emit message to receiver if they are online
  const io = getSocketIO();
  if (userSocketMap[receiverId.toString()]) {
    userSocketMap[receiverId.toString()].forEach(socketId => {
      io.to(socketId).emit("receiveMessage", newMessage);
    });
  }
  const user = await User.findById(receiverId);
  // if (user) {
  //     await sendNotification([user], "NEW_LEAD_ADDED", `New message from ${req.user.userName}: ${text}`, newMessage._id, "Lead");
  // } else {
  //     console.log("❌ No user found for receiverId:", receiverId);
  // }


  // Send Web Push notification if user is offline
  await sendNotification(
    user ? [user] : [],
    "MESSAGE_RECEIVED",
    `New message from ${req.user.userName}: ${text}`,
    newMessage._id,
    "Message"
  );

  res.status(200).json({
    success: true,
    newMessage,
  });

}
)

exports.adminGetAllChats = catchAsyncError(async (req, res, next) => {
  // Check if the requesting user is an admin

  // Get all messages with populated user details
  const allChats = await Message.find({})
    .populate('senderId', 'name email') // Populate sender details
    .populate('receiverId', 'name email') // Populate receiver details
    .sort({ createdAt: -1 }); // Sort by latest messages first

  if (!allChats) {
    return next(new ErrorHandler("No chats found", 404));
  }

  res.status(200).json({
    success: true,
    chats: allChats,
  });
});

// Optional: Add an endpoint to get chats between specific users
exports.adminGetUserChats = catchAsyncError(async (req, res, next) => {
  // Check if the requesting user is an admin

  const { user1Id, user2Id } = req.params;
  console.log("hereo", user1Id, user2Id);
  const chats = await Message.find({
    $or: [
      { senderId: user1Id, receiverId: user2Id },
      { senderId: user2Id, receiverId: user1Id },
    ],
  });
  // .populate('senderId', 'name email')
  // .populate('receiverId', 'name email')
  // // .sort({ createdAt: -1 });

  if (!chats) {
    return next(new ErrorHandler("No chats found between these users", 404));
  }

  res.status(200).json({
    success: true,
    chats,
  });
});


exports.markMessageSeen = catchAsyncError(async (req, res, next) => {
  const { messageId } = req.body;

  if (!messageId) {
    return next(new ErrorHandler("Message ID is required", 400));
  }

  await Message.findByIdAndUpdate(messageId, { $set: { seen: true } });

  res.status(200).json({
    success: true,
    message: "Message marked as seen",
  });
});
