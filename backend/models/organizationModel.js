const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema({
  organizationName: {
    type: String,
    required:true,
    unique : true
  },
  organizationLogo: {
    type: String,
    required:true
  },
  status:{
    type:Boolean,
    default:true
  },
  
});
// Create models for each package type
const OrganizationModel = mongoose.model('Organization', packageSchema);

module.exports = OrganizationModel;
