// const express = require("express");
// const InvoiceModel = require("../models/invoiceModel");
// const router = express.Router();

// router.post("/authorize-webhook", express.json(), async (req, res) => {
//   try {
//     const data = req.body;
//     const transactionId = data.payload?.id;
//     const email = data.payload?.customer?.email;

//     if (!transactionId || !email) {
//       return res.status(400).send("Missing transaction ID or customer email.");
//     }

//     const invoice = await InvoiceModel.findOne({ 'customer.userEmail': email });
//     if (!invoice) return res.status(404).send("Invoice not found");

//     const installment = invoice.installments.find(i => i.status === "Pending");
//     if (!installment) return res.status(400).send("No pending installment");

//     installment.status = "Paid";
//     installment.transactionId = transactionId;

//     await invoice.save();

//     res.status(200).send("Payment updated via webhook");
//   } catch (error) {
//     console.error("Webhook error:", error);
//     res.status(500).send("Server error");
//   }
// });

// module.exports = router;

const express = require("express");
const crypto = require("crypto");
const InvoiceModel = require("../models/invoiceModel");
const bodyParser = require("body-parser");

const router = express.Router();

router.post("/authorize-webhook", bodyParser.raw({ type: "*/*" }), async (req, res) => {
  try {
    const signatureHeader = req.headers["x-anet-signature"];
    const signatureKey = "B514E3F4E67E0838C85FD42354831DE1793896A5768DE23D09072BE797ABF0CB7086CFCFCCB577571A3C984D88DD44FFA87AF436E09D239AC418232A0D98F5D4";

    if (!signatureHeader || !signatureKey) {
      console.warn("❌ Missing signature header or key");
      return res.status(401).send("Unauthorized");
    }

    const rawBody = req.body.toString("utf8"); // comes in as Buffer
    const computedHash = crypto
      .createHmac("sha512", Buffer.from(signatureKey, "hex"))
      .update(rawBody)
      .digest("hex");

    const expectedSignature = `sha512=${computedHash}`;

    console.log("📩 Header Signature:", signatureHeader);
    console.log("🔐 Computed Signature:", expectedSignature);

    if (signatureHeader !== expectedSignature) {
      console.warn("❌ Signature mismatch");
      return res.status(401).send("Invalid signature");
    }

    res.status(200).send("✅ Webhook received");

    const data = JSON.parse(rawBody); // parse only AFTER validation
    console.log("✅ Webhook Payload:", data);

    const transactionId = data.payload?.id;
    const email = data.payload?.customer?.email;

    let invoice = null;
    if (email) {
      invoice = await InvoiceModel.findOne({ "customer.userEmail": email });
    } else {
      invoice = await InvoiceModel.findOne({ "installments.transactionId": transactionId });
    }

    if (!invoice) return console.warn("Invoice not found");

    const installment = invoice.installments.find(i => i.status === "Pending");
    if (!installment) return console.warn("No pending installment found");

    installment.status = "Paid";
    installment.transactionId = transactionId;
    await invoice.save();

    console.log("✅ Invoice updated via webhook");
  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    res.sendStatus(500);
  }
});

module.exports = router;
