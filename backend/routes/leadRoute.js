const express = require("express");
const {
  registerUser,
  getByBrand,
  getAllLeads,
  registerUserAdmin,
  getLeadById,
  updateLead,
  getAssignedLeads,
  allLead,
  bulkDataEntry,
  deleteLead,
  getConvertedFormIds,
  markLeadAsSeen,
} = require("../controllers/leadController");
const router = express.Router();
const awsUpload = require("../middleWare/awsUpload");
const { isAuthenticated, authorizeRole } = require("../middleWare/auth");
const upload = require("../middleWare/upload");

router
  .route("/register")
  .post(isAuthenticated, awsUpload.uploadAWS("signup-files/"), registerUser);
router
  .route("/registerAdmin")
  .post(
    isAuthenticated,
    authorizeRole("admin", "superAdmin", "dataEntry"),
    awsUpload.uploadAWS("signup-files/"),
    registerUserAdmin
  );
router.route("/allLeads").get(isAuthenticated, authorizeRole("admin"), allLead);
router.route("/convertedFormIds").get(isAuthenticated, authorizeRole("admin", "superAdmin", "manager", "ppc", "salesUser", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"), getConvertedFormIds);
router.route("/myLeads/:userId").get(isAuthenticated, getAssignedLeads);
router.route("/getByBrand/:brand").get(getByBrand);
router.route("/leads/search").get(isAuthenticated, getAllLeads);
router.route("/lead/:id").get(isAuthenticated, getLeadById).put(isAuthenticated, authorizeRole("admin", "superAdmin", "user", "ppc", "manager", "salesUser", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"), updateLead);
router.route("/bulkData").post(upload.single("file"), bulkDataEntry);
router
  .route("/lead/:id")
  // .get(isAuthenticated, getLeadById)
  .delete(isAuthenticated, authorizeRole("superAdmin", "admin", "manager", "upsellManager", "upFront"), deleteLead)
// .put(isAuthenticated, authorizeRole( "admin", "user"), updateLead);
router.route("/markLeadAsSeen/:leadId").post(isAuthenticated, markLeadAsSeen);
module.exports = router;
