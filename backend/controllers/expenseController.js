const ErrorHandler = require("../utils/errorHandler");
const cathAsyncError = require("../middleWare/asyncErrors");
const Expense = require("../models/expenseModel");
require("dotenv");

exports.getExpensesByMonths = cathAsyncError(async (req, res, next) => {
  const expensesByMonth = await Expense.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$date" }, // Extract year from date
          month: { $month: "$date" }, // Extract month from date
        },
        total: { $sum: "$amount" }, // Calculate total amount for each month
        expenses: { $push: "$$ROOT" }, // Include all expense documents
      },
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month
    },
  ]);
  res.status(200).json({
    success: true,
    expensesByMonth,
  });
});

exports.createExpenses = cathAsyncError(async (req, res, next) => {
  const expenses = await Expense.create(req.body);
  if (!expenses) {
    return next(new ErrorHandler("Expenses Not Created", 400));
  }
  res.status(200).json({
    success: true,
    expenses,
  });
});

exports.updateExpenses = cathAsyncError(async (req, res, next) => {
  const expenses = await Expense.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Return the updated user document
    runValidators: true, // Run validation on the updated data
  });
  if (!expenses) {
    return next(new ErrorHandler("Expenses Not Updated", 400));
  }
  res.status(200).json({
    success: true,
    expenses,
  });
});

exports.deleteExpenses = cathAsyncError(async (req, res, next) => {
  const expenses = await Expense.findByIdAndDelete(req.params.id);
  if (!expenses) {
    return next(new ErrorHandler("Expenses Not Found", 400));
  }
  res.status(200).json({
    success: true,
    expenses,
  });
});

exports.getExpense = cathAsyncError(async (req, res, next) => {
  const expenses = await Expense.findById(req.params.id);
  if (!expenses) {
    return next(new ErrorHandler("Expenses Not Found", 404));
  }
  res.status(200).json({
    success: true,
    expenses,
  });
});

// exports.getExpenses = cathAsyncError(async (req, res, next) => {
//       const expensesWithTotal = await Expense.aggregate([
//         {
//           $group: {
//             _id: null,
//             total: {
//               $sum: "$amount",
//             },
//             expenses: {
//               $push: "$$ROOT", // Include all expense documents
//             },
//           },
//         },
//         {
//           $project: {
//             _id: 0, // Exclude _id field from the result
//             total: 1,
//             expenses: 1,
//           },
//         },
//       ]);

//       if (!expensesWithTotal || expensesWithTotal.length === 0) {
//         return res.status(404).json({
//           success: false,
//           message: "No expenses found",
//         });
//       }

//       const { total, expenses } = expensesWithTotal[0];
//       res.status(200).json({
//         success: true,
//         expenses,
//         total: total,
//         expensesByMonth
//       });
//     });
