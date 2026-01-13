const express = require("express");
const { isAuthenticated, authorizeRole } = require("../middleWare/auth");
const { createPaymentInfo, getPaymentInfo, deletePaymentInfo, updatePaymentInfo } = require("../controllers/cardInfoController");
const router = express.Router();



router
  .route("/card/:clientId")
  .post(isAuthenticated, authorizeRole("superAdmin", "admin", "manager", "frontsell", "upsell", "user", "upFront" ), createPaymentInfo)
  .get(isAuthenticated, authorizeRole("superAdmin", "admin", "manager", "frontsell", "upsell", "user", "upFront" ), getPaymentInfo)
  .delete(isAuthenticated, authorizeRole("superAdmin", "admin", "manager", "frontsell", "upsell", "user", "upFront" ), deletePaymentInfo)
  .put(isAuthenticated, authorizeRole("superAdmin", "admin", "manager", "frontsell", "upsell", "user", "upFront" ), updatePaymentInfo);

module.exports = router;
