const express = require("express");
const router = express.Router();
const { isAuthenticated, authorizeRole } = require("../middleWare/auth");
const {
  createInvoice,
  getInvoice,
  deleteInvoice,
  updateInvoice,
  getMyInvoices,
  getUserPartialInvoices,
  getInvoices,
  sendInvoiceEmail,
  payInvoice,
  payInstallmentHandler,
  createInstallment,
  getClientInvoices,
  sendPaymentSuccessEmail,
} = require("../controllers/invoiceController");
const { payInstallment } = require("../controllers/paymentController");
router
  .route("/invoice")
  .post(isAuthenticated, authorizeRole("admin", "superAdmin", "manager", "user", "salesUser", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"), createInvoice)
  .get(isAuthenticated, authorizeRole("admin", "superAdmin", "manager", "user", "salesUser", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"), getInvoices);
router
  .route("/invoice/:id")
  .get(getInvoice)
  .delete(isAuthenticated, authorizeRole("admin", "superAdmin", "manager", "user", "salesUser", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"), deleteInvoice)
  .put(isAuthenticated, authorizeRole("admin", "superAdmin", "manager", "user", "salesUser", "upsellManager", "frontsell", "upsell", "upFront", "pmManager", "pm"), updateInvoice);
router.route("/createInstallment/:id").post(isAuthenticated, createInstallment)

router.route("/myInvoice").get(isAuthenticated, getMyInvoices);
router.route("/clientInvoices/:id").get(getClientInvoices)

router
  .route("/payInstallment")
  .put(
    isAuthenticated,
    authorizeRole("admin", "customer", "projectmanager"),
    payInstallment
  );
router.route("/pay/:invoiceId").get(payInvoice);
router.route("/getPartialInvoice/:id").get(isAuthenticated, getUserPartialInvoices);
router.route("/sendMail/:id").post(isAuthenticated, sendInvoiceEmail);
router.route("/paymentSuccessMail/:id").post(isAuthenticated, sendPaymentSuccessEmail);
router.route("/pay-installment/:invoiceId/:installmentIndex").get(payInstallmentHandler);

module.exports = router;
