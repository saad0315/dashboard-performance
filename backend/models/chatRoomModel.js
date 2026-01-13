const mongoose = require("mongoose");

const chatRoomSchema = new mongoose.Schema(
  {

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to users who are in the chat
      },
    ],

    // members: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User", // Reference to the customer user
    //   // required: true,
    // },
    // representative: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User", // Reference to the representative user
    // },
    // project: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Project", // Reference to the project
    //   required: true,
    // },
    // status: {
    //   type: Boolean,
    //   default: true,
    // },
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat", // Reference to the last message
    },
    // seen: {
    //   type: Boolean,
    //   default: false,
    // },
    seenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },

  {
    timestamps: true,
  }
);

// chatRoomSchema.index(
//   { customer: 1, project: 1, representative: 1 },
//   { unique: true }
// );

module.exports = mongoose.model("chatRoom", chatRoomSchema);
