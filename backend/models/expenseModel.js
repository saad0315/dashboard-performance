const { db1 } = require("../config/db");
const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  amount: Number,
  category: {
    type: String,
    enum: ["Advertising","Travel", "Office Supplies", "Utilities", "Other"],
    // Add more categories as needed
  },
  date: { type: Date, default: Date.now },
  // You can add more fields as per your requirement
});

const Expense = db1.model("Expense", expenseSchema);

module.exports = Expense;
