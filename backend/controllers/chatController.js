const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middleWare/asyncErrors");
const Message = require("../models/chatModel");
const chatRoomModel = require("../models/chatRoomModel");

exports.addMessage = catchAsyncError(async (req, res, next) => {
  const { conversationId, text } = req.body;

  const newMessage = await Message.create({
    conversationId,
    sender: req.user.id,
    text,
    files: req.files > 0 ? req.files.map((file) => file.key) : [],
  });

  console.log(newMessage);

  if (!newMessage) {
    return next(new ErrorHandler("Message Can not be Sent", 400));
  }
  res.status(200).json({
    success: true,
    newMessage,
    // message : "Message Sent Successfully"
  });
});


// exports.addMessage = catchAsyncError(async (req, res, next) => {
//   const { conversationId, text } = req.body;
//   console.log(conversationId , text , req.user._id);
//   const newMessage = await Message.create({
//     conversationId,
//     sender: req.user.id,
//     text,
//     // files: req.files ? req.files.map((file) => file.path) : [],
//   });

//   await ChatRoom.findByIdAndUpdate(conversationId, { lastMessage: newMessage._id });

//   res.status(200).json({
//     success: true,
//     newMessage,
//   });
// });

exports.getMessages = catchAsyncError(async (req, res, next) => {
  const messages = await Message.find({
    conversationId: req.params.id,
  }).populate("sender", "name email");

  res.status(200).json({
    success: true,
    messages,
  });
});



// exports.allMessages = catchAsyncError(async (req, res, next) => {
//   await Message.updateMany(
//     {
//       conversationId: req.params.id,
//       seen: false,
//       sender: { $ne: req.user._id },
//     }, // Filter for messages in the conversation that are not yet seen
//     { $set: { seen: true } } // Set the 'seen' property to true
//   );
//   // await chatRoomModel.findByIdAndUpdate(req.params.id , {seen : true});

//   const messages = await Message.find({
//     conversationId: req.params.id,
//   });
//   if (!messages) {
//     return next(new ErrorHandler("No Message Exists", 400));
//   }
//   res.status(200).json({
//     success: true,
//     messages,
//   });
// });

exports.sendFile = catchAsyncError(async (req, res, next) => {
  console.log(req.file);
  res.send("Successdfully uploaded");
});
