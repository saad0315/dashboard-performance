const jwt = require("jsonwebtoken");
const cathAsyncError = require("./asyncErrors");
const express = require("express");
const ErrorHandler = require("../utils/errorHandler");
const User = require("../models/userModel");
// const IPList = require("../models/ipListModel"); 


exports.isAuthenticated = cathAsyncError(async (req, res, next) => {
  let token;
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else {
    const authHeader = req.headers["authorization"];
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.slice(7);
    }
  }
  if (!token) {
    return next(new ErrorHandler("Please Login To Access This Resourse", 401))
  }
  const decodedData = jwt.verify(token, process.env.JWT_SECRET)
  const user = await User.findById(decodedData.id)

  // Check if user is suspended
  if (user.status === 'suspended') {
    // Clear the token cookie
    res.cookie('token', null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });

    return next(new ErrorHandler("Your account has been suspended. Please contact administrator.", 403));
  }

  // if (user.role !== "admin" && user.isRemoteAccessAllowed !== true) {
  //   const ip =
  //     req.headers["x-forwarded-for"] ||
  //     req.connection.remoteAddress ||
  //     req.socket.remoteAddress;

  //   console.log("🔐 User IP:", ip);

  //   const ipListDoc = await IPList.findOne();
  //   const allowedIPs = ipListDoc?.ips || [];

  //   if (!allowedIPs.includes(ip)) {
  //     return next(new ErrorHandler("Access denied from this IP", 403));
  //   }
  // }

  req.user = user
  next();
})

exports.authorizeRole = (...roles) => {
  return (req, res, next) => {
    console.log(roles);
    if (!roles.includes(req?.user?.role)) {
      return next(new ErrorHandler(`Role: ${req?.user?.role} is not allowed to access the resource`, 403));
    }

    next();
  }
}

