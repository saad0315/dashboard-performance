
const mongoose = require("mongoose");

const ccListSchema = new mongoose.Schema({
  emails: [{
    type: String,
    required: true,
    unique: true,
  }],
});

const CCList = mongoose.model("CCList", ccListSchema);

module.exports = CCList;
