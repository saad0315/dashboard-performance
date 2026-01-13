// controllers/ccListController.js

const ErrorHandler = require("../utils/errorHandler");
const cathAsyncError = require("../middleWare/asyncErrors");
const CCList = require("../models/ccListModel");


// Add an email to the CC list
exports.addToCCList = cathAsyncError(async (req, res, next) => {
  const { email } = req.body;

  // Validate the presence of the email in the request body
  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  // Update the document in the CCList collection by adding the new email to the array
  await CCList.updateOne({}, { $addToSet: { emails: email } }, { upsert: true });

  res.status(201).json({
    success: true,
    message: "Email added to the CC list",
  });
});

// Update an email in the CC list
exports.updateCCList = cathAsyncError(async (req, res, next) => {
  const { oldEmail, newEmail } = req.body;

  // Validate the presence of oldEmail and newEmail in the request body
  if (!oldEmail || !newEmail) {
    return next(new ErrorHandler("Both old and new emails are required", 400));
  }

  // Update the document in the CCList collection by updating the email in the array
  await CCList.updateOne({ emails: oldEmail }, { $set: { "emails.$": newEmail } });

  res.status(200).json({
    success: true,
    message: "Email updated in the CC list",
  });
});

// Remove an email from the CC list
exports.removeFromCCList = cathAsyncError(async (req, res, next) => {
  const { email } = req.params;

  // Validate the presence of the email in the request parameters
  if (!email) {
    return next(new ErrorHandler("Email is required", 400));
  }

  // Update the document in the CCList collection by removing the email from the array
  await CCList.updateOne({}, { $pull: { emails: email } });

  res.status(200).json({
    success: true,
    message: "Email removed from the CC list",
  });
});


exports.getAllCCList = cathAsyncError(async (req, res, next) => {
    // Find the document in the CCList collection and return the emails array
    const ccList = await CCList.findOne({});
  
    res.status(200).json({
      success: true,
      ccList: ccList ? ccList.emails : [],
    });
  });
