const express = require("express");
const { isAuthenticated, authorizeRole } = require("../middleWare/auth");
const {
  createSale,
  updateSale,
  getAllSales,
  deleteSale,
  getSale,
  getSalesByMonths,
  getSalesBySalesPerson,
  getSalesByClient,
  getsaleTest,
  getSalesByLead,
} = require("../controllers/salesController");
const awsUpload = require("../middleWare/awsUpload");
const router = express.Router();

router.route("/sale").get(isAuthenticated, getAllSales);
router.route("/testsale").get(getsaleTest);

router
  .route("/sale")
  .post(
    isAuthenticated,
    awsUpload.uploadAWSSingle("sales-files/"),
    authorizeRole("admin", "superAdmin", "dataEntry", "manager", "user", "salesUser", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"),
    createSale
  )
router
  .route("/salesByMonth")
  .get(isAuthenticated, authorizeRole("superAdmin", "admin", "manager", "user", "salesUser", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"), getSalesByMonths);

router
  .route("/getSalesBySalesPerson/:salesPersonId")
  .get(
    isAuthenticated,
    authorizeRole("user", "admin", "superAdmin", "manager", "salesUser", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"),
    getSalesBySalesPerson
  );
router
  .route("/getSalesByClient/:id")
  .get(
    isAuthenticated,
    authorizeRole("user", "admin", "superAdmin", "manager", "salesUser", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"),
    getSalesByClient
  );
router
  .route("/getSalesByLead/:id")
  .get(
    isAuthenticated,
    authorizeRole("user", "admin", "superAdmin", "manager", "salesUser", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"),
    getSalesByLead
  );

router
  .route("/sale/:id")
  .get(isAuthenticated, authorizeRole("superAdmin", "admin", "manager", "user", "salesUser", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"), getSale)
  .delete(isAuthenticated, authorizeRole("superAdmin", "admin"), deleteSale)
  .put(isAuthenticated, authorizeRole("superAdmin", "admin", "manager", "user", "salesUser", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"), updateSale);

module.exports = router;
