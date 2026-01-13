const Subscription = require("../models/subscriptionModel");
const { sendPushNotification } = require("../utils/webpush");


// let subscriptions = []; // Temporary storage (Best practice: Use DB)


exports.saveSubscription = async (req, res) => {
    try {
        const { userId, subscription } = req.body;

        if (!userId || !subscription) {
            return res.status(400).json({ error: "User ID and subscription are required" });
        }

        // Pehle check karein ke user ki subscription pehle se exist to nahi karti
        const existingSubscription = await Subscription.findOne({ userId });

        if (existingSubscription) {
            // Agar subscription pehle se hai, to usko update kar dein
            existingSubscription.endpoint = subscription.endpoint;
            existingSubscription.keys = subscription.keys;
            await existingSubscription.save();
        } else {
            // Nahi hai to naye subscription ko save kar dein
            await Subscription.create({
                userId,
                endpoint: subscription.endpoint,
                keys: subscription.keys
            });
        }

        res.status(201).json({ message: "Subscription saved successfully" });
    } catch (error) {
        console.error("❌ Error saving subscription:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.subscribe = (req, res) => {
  const subscription = req.body;
  if (!subscription) {
    return res.status(400).json({ error: "Subscription data is required" });
  }

  subscriptions.push(subscription);
  res.status(201).json({ message: "Subscription added!" });
};

exports.deleteSubscription = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // User ki subscription delete karna
        await Subscription.deleteOne({ userId });

        console.log(`🗑 Subscription deleted for user: ${userId}`);
        res.status(200).json({ message: "Subscription deleted successfully" });

    } catch (error) {
        console.error("❌ Error deleting subscription:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


exports.sendNotification = async (req, res) => {
  const { title, body } = req.body;

  if (subscriptions.length === 0) {
    return res.status(400).json({ error: "No subscribers found" });
  }

  const payload = {
    title: title || "New Notification",
    body: body || "You have a new notification",
    // icon: "/icon.png", // Optional icon
  };

  for (let sub of subscriptions) {
    await sendPushNotification(sub, payload);
  }

  res.json({ message: "Push notification sent!" });
};
