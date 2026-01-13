const { db1 } = require("../config/db");
const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
    },
    userName: {
      type: String,
      required: [true, "Enter Your Name"],
      minLength: [2, "Name should be Greater than 2 Character "],
    },
    userEmail: {
      type: String,
      required: [true, "Enter Your Email Address"],
    },
    userPhone: {
      type: String,
      // required: [true, "Enter Your Phone Number"],
    },
    companyName: {
      type: String,
      required: [true, "Enter Your Company Name"],
    },
    businessName: {
      type: String,
    },

    fullPageUrl: {
      type: String,
      default: "Website",
    },
    message: {
      type: String,
    },
    ipInfo: {
      type: Object,
    },
    assigned: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },
        team: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Team",
          // required: true
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
      default: "New",
      // enum: ["New", "Contacted", "Qualified", "Converted", "Lost"]
    },
    leadType: {
      type: String,
      // enum: ["chat", "signUp", "inbound", "social", "referral", "cold"],
    },
    source: {
      type: String,
      // enum: ["ppc", "smm", "cold", "referral"],
    },
    last4Digits: {
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
    seenBy: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      seenAt: {
        type: Date,
        default: Date.now
      }
    }],
    date: {
      type: Date,
      default: Date.now,
    },
  },

  {
    timestamps: true,
  }
);

const Lead = db1.model("Lead", leadSchema);

module.exports = Lead;


// const { db1 } = require("../config/db");
// const mongoose = require("mongoose");

// const leadSchema = new mongoose.Schema(
// {
//   formId: {
//    type:  mongoose.Schema.Types.ObjectId,
//   },
//     companyName: {
//       type: String,
//       required: true,
//     },
//     formData: {
//       type: mongoose.Schema.Types.Mixed,
//       required: true,
//     },
//     assignedTo: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User", // Reference to the salesperson who is assigned to this lead
//     },
//     status: {
//       type: String,
//       enum: ["New", "Contacted", "Qualified", "Converted", "Lost"],
//       default: "New",
//     },
//     comments: [
//       {
//         text: String,
//         postedBy: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "User", // Reference to the user who posted the comment
//         },
//         createdAt: {
//           type: Date,
//           default: Date.now,
//         },
//       },
//     ],
//     source: {
//       type: String,
//       default: "Website",
//     },
//   },
//   { timestamps: true }
// );

// const Lead = db1.model("Lead", leadSchema);

// module.exports = Lead;
