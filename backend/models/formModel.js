const { db2 } = require("../config/db");
const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  formData: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
}, { timestamps: true });

const Form = db2.model("Form", formSchema);

module.exports = Form;
