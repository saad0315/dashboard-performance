const mongoose = require('mongoose');

// Define a schema for individual services
const serviceSchema = new mongoose.Schema({
  name: String,
});

// Define a schema for a package
const packageSchema = new mongoose.Schema({
  packageName: {
    type: String,
    required:true
  },
  packageType: {
    type: String,
    required:true
  }, // 'Marketing', 'Publishing', or 'Other'
  price: {
    type: Number,
    required:true
  },
  services: [serviceSchema],
  status:{
    type:Boolean,
    default:true
  }
});
// Create models for each package type
const PackageModel = mongoose.model('packages', packageSchema);

module.exports = PackageModel;
