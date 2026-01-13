const crypto = require('crypto');  // Built-in Node.js module for encryption
const { db1 } = require("../config/db");
const Lead = require("../models/leadModel");
const CardInfo = require("../models/cardInfoModel");
const cathAsyncError = require("../middleWare/asyncErrors");
const ErrorHandler = require("../utils/errorHandler"); // Assuming you have this error handler utility
const encryptionKey = process.env.ENCRYPTION_KEY;  // Store the encryption key securely in environment variables

// Function to encrypt card number
const encryptCardNumber = (cardNumber) => {
  // Generate a random 16-byte IV for each encryption
  const iv = crypto.randomBytes(16);
  
  // Create cipher using aes-256-cbc encryption algorithm and the IV
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'utf-8'), iv);
  
  let encrypted = cipher.update(cardNumber, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  // Return the IV and encrypted data to store
  return { iv: iv.toString('hex'), encryptedCardNumber: encrypted };
};

// Function to decrypt card number
const decryptCardNumber = (encryptedData) => {
  const iv = Buffer.from(encryptedData.iv, 'hex');
  const encryptedCardNumber = encryptedData.encryptedCardNumber;
  
  // Create decipher using aes-256-cbc algorithm and the IV
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(encryptionKey, 'utf-8'), iv);
  
  let decrypted = decipher.update(encryptedCardNumber, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};


exports.createPaymentInfo = cathAsyncError(async (req, res, next) => {
    const { clientId } = req.params;
    const { name, number, expiry, issuer } = req.body; // Get card number from request

    // Check if lead exists
    const lead = await Lead.findById(clientId);
    if (!lead) {
        return next(new ErrorHandler("Lead not found", 404));
    }

    // Get the last 4 digits of the card number
    const last4Digits = number.slice(-4);

    
    // console.log("card Data" , req.body)
    
    // const cardInfo = await CardInfo.create({
    //     clientId,
    //     cardHolderName,
    //     last4Digits,
    //     cardNumber: encryptedCardNumber,  // Store the encrypted card number
    //     cardType: issuer,
    //     expirationDate: expiry,
    // });

    // if (!cardInfo) {
    //     return next(new ErrorHandler("Payment info could not be created", 400));
    // }

    res.status(201).json({
        success: true,
        // cardInfo,
    });
});

// Update payment info for a specific client
exports.updatePaymentInfo = cathAsyncError(async (req, res, next) => {
    const { clientId } = req.params;
    const { cardHolderName, last4Digits, cardType, token, expirationDate } = req.body;

    // Find the payment info for this client
    const cardInfo = await CardInfo.findOneAndUpdate(
        { clientId },
        { cardHolderName, last4Digits, cardType, token, expirationDate },
        { new: true, runValidators: true }
    );

    if (!cardInfo) {
        return next(new ErrorHandler("Payment info not found or could not be updated", 404));
    }

    res.status(200).json({
        success: true,
        cardInfo,
    });
});

// Delete payment info for a specific client
exports.deletePaymentInfo = cathAsyncError(async (req, res, next) => {
    const { clientId } = req.params;

    // Find and delete the payment info for this client
    const cardInfo = await CardInfo.findOneAndDelete({ clientId });

    if (!cardInfo) {
        return next(new ErrorHandler("Payment info not found or could not be deleted", 404));
    }

    res.status(200).json({
        success: true,
        message: "Payment info deleted successfully",
    });
});

exports.getPaymentInfo = cathAsyncError(async (req, res, next) => {
    const { clientId } = req.params;

    const cardInfo = await CardInfo.findOne({ clientId });

    if (!cardInfo) {
        return next(new ErrorHandler("Payment info not found", 404));
    }

    res.status(200).json({
        success: true,
        cardInfo,
    });
});
