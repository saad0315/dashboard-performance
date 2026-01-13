const express = require("express");
const { subscribe, sendNotification, saveSubscription, deleteSubscription } = require("../controllers/webpushController");

const router = express.Router();

router.post("/subscribe", saveSubscription);
router.post("/sendNotification", sendNotification);
router.post("/unsubscribe", deleteSubscription); // Subscription Delete karne ka route

module.exports = router;
