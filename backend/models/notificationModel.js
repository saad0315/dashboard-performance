const { db1 } = require("../config/db");
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],
  sender:
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['NEW_LEAD_ADDED', 'LEAD_ASSIGNED', 'NEW_SALE_CREATED', 'SALE_UPDATED', 'MESSAGE_RECEIVED', 'SALE_MADE'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'onModel'
  },
  // onModel: {
  //   type: String,
  //   enum: ['Lead', 'Message', 'Sale']
  // },
  readBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]

}, { timestamps: true });

const Notification = db1.model("Notification", notificationSchema);
module.exports = Notification;