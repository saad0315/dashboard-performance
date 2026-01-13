const ErrorHandler = require("../utils/errorHandler");
const AsyncError = require("../middleWare/asyncErrors");
const Package = require("../models/PackageModel");

exports.createPackages = AsyncError(async (req, res, next) => {
  // console.log(req.body);
  const packages = await Package.create(req.body);
  if (!packages) {
    return next(new ErrorHandler("Packages can not be created", 400));
  }
  res.status(201).json({
    success: true,
    packages,
  });
});
exports.deletePackage = AsyncError(async (req, res, next) => {
  // console.log(req.body);
  const packages = await Package.findByIdAndDelete(req.params.packageId);
  if (!packages) {
    return next(new ErrorHandler("Unable to delete package", 400));
  }
  res.status(201).json({
    success: true,
    message: "Package deleted successfully",
  });
});

exports.getPackages = AsyncError(async (req, res, next) => {
  // console.log(req.body);
  const packages = await Package.find();
  if (!packages) {
    return next(new ErrorHandler("Packages can not be created", 400));
  }
  res.status(200).json({
    success: true,
    packages,
  });
});

exports.updatePackage = AsyncError(async (req, res, next) => {
  const packageId = req.params.packageId;
  const { packageName, packageType, price } = req.body; // Updated package data

  // Find the package by ID
  const package = await Package.findById(packageId);

  if (!package) {
    return res.status(404).json({ message: "Package not found" });
  }

  // Update package fields
  if (packageName) {
    package.packageName = packageName;
  }
  if (packageType) {
    package.packageType = packageType;
  }
  if (price) {
    package.price = price;
  }

  // Save the updated package
  await package.save();
  res.status(200).json({
    success: true,
    package,
  });
});

exports.updateService = AsyncError(async (req, res, next) => {
  // console.log(req.body);
  const { name, type, price, packageId, serviceId, serviceName } = req.body; // The updated service data

  // Find the package by ID
  const package = await Package.findById(packageId);

  if (!package) {
    return next(new ErrorHandler("Package not found", 404));
  }

  // Find the service within the package by ID
  const service = package.services.id(serviceId);

  if (!service) {
    return next(new ErrorHandler("Service not found", 404));
  }

  // Update the service fields
  if (name) {
    package.name = name;
  }
  if (type) {
    package.packageType = type;
  }
  if (price) {
    package.price = price;
  }
  if (serviceName && service) {
    service.name = serviceName;
  }

  await package.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
    package,
  });
});
