const ErrorHandler = require("../utils/errorHandler");
const AsyncError = require("../middleWare/asyncErrors");
const Order = require('../models/orderModel')


exports.createOrders = AsyncError(async (req, res, next) => {
    const orders = await Order.create({...req.body, paidAt:Date.now()});
    if(!orders){
        return next(new ErrorHandler("Orders can not be created", 400));
    }
    res.status(201).json({
        success: true,
        orders
    });
}); 
exports.getOrders = AsyncError(async (req, res, next) => {
    // console.log(req.body);
    const orders = await Order.find();
    if(!orders){
        return next(new ErrorHandler("No Orders Available", 400));
    }
    res.status(200).json({
        success: true,
        orders
    });
}); 

exports.getMyOrders = AsyncError(async (req, res, next) => {
    // console.log(req.body);
    const orders = await Order.find({customerId:req.user._id});
    if(!orders){
        return next(new ErrorHandler("No Orders Available", 400));
    }
    res.status(200).json({
        success: true,
        orders
    });
}); 