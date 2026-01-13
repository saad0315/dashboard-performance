const { db1 } = require("../config/db");

const mongoose = require("mongoose");

const salesSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead", // Reference to the lead associated with this sale
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true, // Make it required to ensure every sale is tied to a team
    },
    amount: {
      type: Number,
      required: true,
    },
    salesPerson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Reference to the salesperson who made the sale
      required: true,
    },
    saleType: {
      type: String,
      enum: ["upSell", "frontSell", "crossSell"],
      required: true,
      default: "frontSell"
    },
    date: {
      type: Date,
      default: Date.now,
    },
    saleAgreement: {
      type: String,
    },
    services: [
      {
        type: String,
        required: true,
      }
    ],
    saleDescription: {
      type: String,
    },
    refunded: {
      type: Boolean,
      default: false,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    comments: [
      {
        text: String,
        postedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const Sales = db1.model("Sales", salesSchema);

module.exports = Sales;

