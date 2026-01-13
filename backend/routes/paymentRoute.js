const express = require("express");
const router = express.Router();
const { chargeCreditCard, getTransactionDetails, getPaymentLink } = require("../controllers/paymentController");

router.route("/payment").post(chargeCreditCard)
router.route("/transaction/:transactionId").get(getTransactionDetails)

module.exports = router