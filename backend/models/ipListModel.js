const { db1 } = require("../config/db");
const mongoose = require("mongoose");

const ipListSchema = new mongoose.Schema({
  ips: [{
    type: String,
    required: true,
    unique: true,
  }],
});

const IPList = db1.model("IPList", ipListSchema);

module.exports = IPList;
