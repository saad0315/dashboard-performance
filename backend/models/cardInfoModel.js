const { db1 } = require("../config/db");
const mongoose = require("mongoose");

const cardInfoSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead", 
      required: true,
    },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "invoices", 
      required: true,
    },
    name: {
      type: String,
      required: [true, "Cardholder's name is required"],
    },
    last4Digits: {
      type: String,
      required: [true, "Last 4 digits of the card number are required"],
    },
    issuer: {
      type: String, // Visa, MasterCard, etc.
      required: [true, "Card type is required"],
    },
    cardToken: {
      type: String, // opaqueData or Authorize.net payment profile ID
      // required: [true, "Card token is required"],
    },
    expiry: {
      type: String, // Format: MM/YY
      required: [true, "Card expiration date is required"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const CardInfo = db1.model("CardInfo", cardInfoSchema);

module.exports = CardInfo;
