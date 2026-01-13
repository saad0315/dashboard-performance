const { db1 } = require("../config/db");

const mongoose = require("mongoose")

const FileDataSchema = new mongoose.Schema({
  src: { type: String, required: true },
  name: { type: String, required: true },
  size: [{ type: Number, required: true }],
  type: { type: String }
}, { _id: false });


const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    fileData: FileDataSchema 
  },
  { timestamps: true }
);


const Message = db1.model("Message", messageSchema)

module.exports = Message;
