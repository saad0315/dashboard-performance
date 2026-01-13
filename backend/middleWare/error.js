const ErrorHandler = require("../utils/errorHandler")

module.exports = (err ,req,res,next)=>{
    err.statusCode = err.statusCode || 500; 
    err.message = err.message || "Internal server Error"

    if(err.name === "CastError"){
        const message = `Resource not found. Invalid : ${err.path}`
        err  = new ErrorHandler(message,400)
    }
    if(err.code === 11000) {
        const duplicatedKey = Object.keys(err.keyValue)[0];
        const message = `${camelCaseToSpacedString(duplicatedKey)} already exists. Please provide another ${camelCaseToSpacedString(duplicatedKey)} `;
        err = new ErrorHandler(message, 400);
    }
    if(err.name === "JsonWebTokenError"){
        const message = "Json web token is invalid: Try again";
        err = new ErrorHandler(message, 400);
    }
     if(err.name === "TokenExpireError"){
        const message = "Json web token is Expire: Try again";
        err = new ErrorHandler(message, 400);
    }



    res.status(err.statusCode).json({
        success : false,
        message : err.message
    })
}
function camelCaseToSpacedString(input) {
    // Add a space before each capital letter (except the first one)
    const spacedString = input.replace(/([A-Z])/g, ' $1');
    
    // Capitalize the first letter and remove leading space
    return spacedString.charAt(0).toUpperCase() + spacedString.slice(1).trim();
  }