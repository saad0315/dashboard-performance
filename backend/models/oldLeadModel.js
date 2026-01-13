const { db1 } = require("../config/db");
const mongoose = require("mongoose");

const oldLeadSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: [true, "Enter Your Name"],
    minLength: [2, "Name should be Greater than 2 Character "],
  },
  userEmail: {
    type: String,
  },
  userPhone: {
    type: String,
  },
  assigned: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
      },
      role: {
        type: String, // e.g., "frontSales", "upsell", "projectManager"
      },
      status: {
        type: String,
        default: "New",
        // enum: ["New", "Contacted", "Qualified", "Converted", "Lost"]
      },
      assignedAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
      },
      followUp: {
        isActive: {
          type: Boolean,
          default: false
        },
        startDate: {
          type: Date,
        },
        endDate: {
          type: Date,
        },
      },
    }
  ],
  status: {
    type: String,
  },
  comments: [
    {
      text: String,
      postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the user who posted the comment
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}, { timestamps: true });

const OldLead = db1.model("OldLead", oldLeadSchema);

module.exports = OldLead;
