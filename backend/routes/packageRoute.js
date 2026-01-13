const express = require("express")
const { isAuthenticated, authorizeRole } = require("../middleWare/auth")
const { createPackages, getPackages, updatePackage, updateService, deletePackage } = require("../controllers/PackageController")
const router = express.Router()

router.route("/package").post(isAuthenticated,authorizeRole('admin'),createPackages).get(getPackages)
router.route("/package/service").put(isAuthenticated,authorizeRole('admin'),updateService)
router.route("/package/:packageId").put(isAuthenticated,authorizeRole('admin',updatePackage)).delete(isAuthenticated,authorizeRole('admin'), deletePackage)
// router.route("/messages/:id").get(isAuthenticated,allMessages)

module.exports = router