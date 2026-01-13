const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleWare/asyncErrors");
const ChatRoom = require("../models/chatRoomModel");
const Message = require("../models/chatModel");
const { default: mongoose } = require("mongoose");

// const User = require('../models/userModel'); // Import your User model

exports.newChatRoom = catchAsyncError(async (req, res, next) => {
  console.log(req.user.id);
  const room = await ChatRoom.create({
    members: [req.user.id, req.body.receiverId],
  });
  if (!room) {
    return next(new ErrorHandler("Conversation Can not be Created", 400));
  }
  res.status(200).json({
    success: true,
    room,
  });
});

// exports.createChatRoom = catchAsyncError(async (req, res, next) => {
//   const { userId } = req.body; // The ID of the other user to chat with

//   // Check if a room already exists between these two users
//   let chatRoom = await ChatRoom.findOne({
//     members: { $all: [req.user.id, userId] },
//   });

//   if (!chatRoom) {
//     chatRoom = await ChatRoom.create({
//       members: [req.user._id, userId],
//     });
//   }

//   res.status(200).json({
//     success: true,
//     chatRoom,
//   });
// });



exports.createChatRoom = catchAsyncError(async (req, res, next) => {
  try {
    // Convert user IDs to ObjectId
    const userId = mongoose.Types.ObjectId(req.body.userId); // Convert provided userId to ObjectId
    const currentUserId = mongoose.Types.ObjectId(req.user.id); // Convert sender's userId to ObjectId

    const room = await ChatRoom.create({
      members: [currentUserId, userId], // Ensure both are ObjectId
    });

    if (!room) {
      return next(new ErrorHandler("Conversation Cannot be Created", 400));
    }

    res.status(200).json({
      success: true,
      room,
    });
  } catch (error) {
    return next(new ErrorHandler("Invalid User ID Format", 400));
  }
});



exports.getUserChatRooms = catchAsyncError(async (req, res, next) => {
  const chatRooms = await ChatRoom.find({ members: req.user._id })
    .populate("members", "name email") // Populate user details
    .populate("lastMessage");

  res.status(200).json({
    success: true,
    chatRooms,
  });
});



// exports.getChatRoom = catchAsyncError(async (req, res, next) => {
//   const chatRooms = await ChatRoom.find({
//     members: {
//       $in: [req.user.id]
//     }
//   }).populate({
//     path: 'members',
//     select: 'userName'
//   }).populate({
//     path:'startupId',
//     select:'startupName'
//   });

//   if (!chatRooms || chatRooms.length === 0) {
//     return next(new ErrorHandler("Conversation Doesn't Exist", 400));
//   }

//   res.status(200).json({
//     success: true,
//     chatRooms
//   });
// });

exports.testChatRoom = catchAsyncError(async (req, res, next) => {
  const chatRoomsWithLastMessages = await ChatRoom.aggregate([
    {
      $match: {
        members: new mongoose.Types.ObjectId(req.user.id),
      },
    },
    {
      $lookup: {
        from: "chats",
        localField: "_id",
        foreignField: "conversationId",
        as: "lastMessage",
        pipeline: [
          { $sort: { createdAt: -1 } },
          { $limit: 1 },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "members",
        foreignField: "_id",
        as: "members",
      },
    },
    {
      $project: {
        _id: 1,
        members: {
          _id: 1,
          userName: 1,
          userEmail: 1,
          role: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        },
        seenBy: 1,
        createdAt: 1,
        updatedAt: 1,
        lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
      },
    },
  ]);

  if (!chatRoomsWithLastMessages || chatRoomsWithLastMessages.length === 0) {
    return res.status(200).json({
      success: true,
      chatRoomsWithLastMessages: [],
    });
  }

  res.status(200).json({
    success: true,
    chatRoomsWithLastMessages,
  });
});




// exports.testChatRoom = catchAsyncError(async (req, res, next) => {
//   const chatRoomsWithLastMessages = await ChatRoom.aggregate([
//     {
//       $match: {
//         $or: [{ customer: req.user._id }, { representative: req.user._id }],
//       },
//     },

//     {
//       $lookup: {
//         from: "chats",
//         localField: "_id",
//         foreignField: "conversationId",
//         as: "lastMessage",
//         pipeline: [
//           {
//             $sort: {
//               createdAt: -1,
//             },
//           },
//           {
//             $limit: 1,
//           },
//         ],
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "customer",
//         foreignField: "_id",
//         as: "customer",
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "representative",
//         foreignField: "_id",
//         as: "representative",
//       },
//     },
//     {
//       $lookup: {
//         from: "projects",
//         localField: "project",
//         foreignField: "_id",
//         as: "project",
//       },
//     },
//     {
//       $project: {
//         _id: 1,
//         seen: 1,
//         customer: { $arrayElemAt: ["$customer", 0] },
//         representative: { $arrayElemAt: ["$representative", 0] },
//         project: { $arrayElemAt: ["$project", 0] },
//         lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
//       },
//     },
//   ]);
//   if (!chatRoomsWithLastMessages || chatRoomsWithLastMessages.length === 0) {
//     // return next(new ErrorHandler("Conversation Doesn't Exist", 400));
//     res.status(200).json({
//       success: true,
//       chatRoomsWithLastMessages: [],
//     });
//   }
//   res.status(200).json({
//     success: true,
//     chatRoomsWithLastMessages,
//   });
// });

exports.getChatRoom = catchAsyncError(async (req, res, next) => {
  const chatRoomsWithLastMessages = await ChatRoom.find({
    customer: req.user._id,
  })
    .populate({
      path: "representative",
    })
    .populate({
      path: "project",
    })
    .populate("customer");

  console.log(chatRoomsWithLastMessages);

  // Fetch the last message for each chat room

  res.status(200).json({
    success: true,
    chatRoomsWithLastMessages,
    // chatRoomsWithLastMessages1,
  });
});

// exports.getAdminChats = catchAsyncError(async (req, res, next) => {
//   const chatRoomsWithLastMessages = await ChatRoom.find({
//     $or: [
//       { representative: null }, // Match chat rooms where representative is null
//       { representative: req.user._id }, // Match chat rooms where representative matches req.user._id
//     ],
//   })
//     .populate({
//       path: "representative",
//     })
//     .populate({
//       path: "project",
//     })
//     .populate("customer");

//   const chatRoomsWithLastMessages1 = await ChatRoom.aggregate([
//     {
//       $match: {
//         $or: [{ customer: req.user._id }, { representative: req.user._id }],
//       },
//     },
//     {
//       $lookup: {
//         from: "chats",
//         localField: "_id",
//         foreignField: "conversationId",
//         as: "lastMessage",
//         pipeline: [
//           {
//             $sort: {
//               createdAt: -1,
//             },
//           },
//           {
//             $limit: 1,
//           },
//         ],
//       },
//     },
//     {
//       $lookup: {
//         from: "chats",
//         localField: "_id",
//         foreignField: "conversationId",
//         as: "unReadCount",
//         pipeline: [
//           {
//             $match: {
//               seen: false, // Match only unseen messages
//               sender: { $ne: req.user._id }, // Exclude messages sent by the user
//             },
//           },
//         ],
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "customer",
//         foreignField: "_id",
//         as: "customer",
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "representative",
//         foreignField: "_id",
//         as: "representative",
//       },
//     },
//     {
//       $lookup: {
//         from: "projects",
//         localField: "project",
//         foreignField: "_id",
//         as: "project",
//       },
//     },
//     {
//       $project: {
//         _id: 1,
//         customer: { $arrayElemAt: ["$customer", 0] },
//         representative: { $arrayElemAt: ["$representative", 0] },
//         project: { $arrayElemAt: ["$project", 0] },
//         lastMessage: { $arrayElemAt: ["$lastMessage", 0] },
//         unReadCount: { $size: "$unReadCount" },
//       },
//     },
//   ]);
//   // console.log(chatRoomsWithLastMessages1);
//   res.status(200).json({
//     success: true,
//     chatRoomsWithLastMessages: chatRoomsWithLastMessages1,
//   });
// });

exports.getAdminChats = catchAsyncError(async (req, res, next) => {
  console.log(req.user._id);
  const chatRoomsWithLastMessages = await ChatRoom.find({
    representative: req.user._id,
  })
    .populate({
      path: "representative",
    })
    .populate({
      path: "project",
    })
    .populate("customer");

  console.log(chatRoomsWithLastMessages);
  res.status(200).json({
    success: true,
    chatRoomsWithLastMessages,
    // chatRoomsWithLastMessages1,
  });
});

exports.assignChat = catchAsyncError(async (req, res, next) => {
  const { conversationId } = req.body;
  const chatroom = await ChatRoom.findByIdAndUpdate(
    conversationId,
    { representative: req.user._id },
    { new: true }
  );
  if (!chatroom) {
    return next(new ErrorHandler("Unable to assign chat", 400));
  }
  res.status(200).json({
    success: true,
    message: "You Have been assigned to Customer",
  });
});
