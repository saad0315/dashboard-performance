const ErrorHandler = require("../utils/errorHandler");
const AsyncError = require("../middleWare/asyncErrors");
const Organization = require("../models/organizationModel");

exports.createOrganization = AsyncError(async (req, res, next) => {
  const { organizationName } = req.body;
  const organizationLogo = req.file.key
  const organization = await Organization.create({
    organizationName,
    organizationLogo,
  });
  if (!organization) {
    return next(new ErrorHandler("Organization can not be created", 400));
  }
  res.status(201).json({
    success: true,
    organization,
  });
});

exports.getOrganizations = AsyncError(async (req, res, next) => {
  // console.log(req.body);
//   console.log(file);
  const organizations  = await Organization.find()

  if (!organizations) {
    return next(new ErrorHandler("Organization can not be created", 400));
  }
  res.status(201).json({
    success: true,
    organizations,
  });
});