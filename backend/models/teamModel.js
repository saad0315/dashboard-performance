// const { db1 } = require("../config/db");
// const mongoose = require("mongoose");

// const teamSchema = new mongoose.Schema({
//     teamName: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     department: {
//         type: String,
//         required: true,
//         trim: true,
//     },
//     teamType: {
//         type: String,
//         enum: ["frontSell", "upSell", "projectManagement", "crossSell"]
//     },
//     manager: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User",
//         required: true,
//     },
//     members: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "User"
//     }],
//     status: {
//         type: Boolean,
//         default: true,
//     }
// }, { timestamps: true });

// const Team = db1.model("Team", teamSchema);

// module.exports = Team;


const { db1 } = require("../config/db");
const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    teamName: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    department: {
      type: String,
      required: true,
      trim: true,
      enum: ["frontSell", "upsell", "projectManager", "ppc", "dataEntry", "admin"]
    },
    description: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active"
    }
  },
  { timestamps: true }
);


const Team = db1.model("Team", teamSchema);

module.exports = Team;
