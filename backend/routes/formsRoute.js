const express = require("express");
const { isAuthenticated, authorizeRole } = require("../middleWare/auth");
const { getFormData, deleteForm, getOldData, updateOldLead } = require("../controllers/formController");
// const { updateOldLead } = require("../controllers/oldLeadController");

const router = express.Router();

router.route("/getForms/search").get(isAuthenticated , authorizeRole("admin" , "superAdmin" , "user" , "ppc" , "frontsell", "upsellManager", "upsell", "manager", "upFront","pmManager", "pm") , getFormData);
router.route("/getOldLeads/search").get(isAuthenticated , authorizeRole("admin" , "superAdmin" , "user" , "ppc" , "frontsell", "upsellManager", "upsell", "manager", "user", "salesUser", "upFront", "pmManager", "pm") , getOldData);
router.route("/form/:id").delete(isAuthenticated , authorizeRole("admin") , deleteForm);
router.route("/oldLead/:id").put(isAuthenticated, authorizeRole("admin", "superAdmin", "user", "ppc", "manager", "salesUser", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"), updateOldLead);


module.exports = router;
