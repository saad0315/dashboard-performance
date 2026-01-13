const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    amount:{
        type:Number,
        required:true,
    },
    discountedAmount:{
        type:Number,
        required:true,
    },
    orderItems :[{
            type : mongoose.Schema.ObjectId,
            ref : "Services",
            required : true
         }],
     orderStatus : {
        type : String,
        required : true,
        enum:["processing" , 'completed', 'cancelled'],
        default : "processing"
     },
     taxPrice : {
        type: Number , 
        default : 0
        , required : true
        
     },
     attachedFiles :[String],
     note:{
        type:String,
        
     },
    paidAt : {type : Date, required : true},
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);