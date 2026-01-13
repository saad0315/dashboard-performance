const { db1 } = require("../config/db");
const mongoose = require("mongoose");

const SubscriptionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    endpoint: { type: String, required: true },
    keys: {
        p256dh: { type: String, required: true },
        auth: { type: String, required: true }
    }
});
const Subscription = db1.model("Subscription", SubscriptionSchema);

module.exports = Subscription;