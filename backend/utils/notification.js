// const { getSocketIO, userSocketMap } = require("./socket"); // Import getSocketIO

// const sendNotification = (usersToNotify, type, message, relatedId, model) => {
//     try {
//         console.log("🔄 Trying to get socket instance...");
//         const io = getSocketIO(); // Get socket instance
//         console.log("✅ Socket.IO instance retrieved successfully!");

//         usersToNotify.forEach(user => {
//             console.log(`📢 Sending notification to user: ${user._id}`);

//             if (userSocketMap[user._id.toString()]) {
//                 console.log(`✅ User found in socket map: ${user._id}, Sockets: ${userSocketMap[user._id.toString()]}`);

//                 userSocketMap[user._id.toString()].forEach(socketId => {
//                     console.log(`🚀 Emitting to socketId: ${socketId}`);
//                     io.to(socketId).emit("receiveNotification", {
//                         type, content: message, relatedId, onModel: model
//                     });
//                 });

//             } else {
//                 console.log(`❌ User ${user._id} is NOT online`);
//             }
//         });
//     } catch (error) {
//         console.error("❌ Error sending notification:", error.message);
//     }
// };

// module.exports = { sendNotification };



const Subscription = require("../models/subscriptionModel");
const { getSocketIO, userSocketMap } = require("./socket");
const { sendPushNotification } = require("./webpush");

const sendNotification = async (usersToNotify, type, message, relatedId, model) => {
    try {
        const io = getSocketIO();

        for (const user of usersToNotify) {
            console.log(`📢 Sending notification to user: ${user._id}`);

            if (userSocketMap[user._id.toString()]) {
                console.log(`✅ User is ONLINE: ${user._id}, Sending via Socket.IO`);

                userSocketMap[user._id.toString()].forEach(socketId => {
                    io.to(socketId).emit("receiveNotification", {
                        type, content: message, relatedId, onModel: model
                    });
                });
            } else {
                console.log(`❌ User ${user._id} is OFFLINE. Checking Web Push Subscription...`);

                const subscription = await Subscription.findOne({ userId: user._id });

                if (subscription) {
                    console.log(`📩 Sending Web Push Notification to ${user._id}`);
                    await sendPushNotification(subscription, {
                        title: type,
                        body: message,
                        icon: "/icon.png",
                        url: "https://ebook.madcomdigital.com/"
                    });
                } else {
                    console.log(`⚠ No Web Push Subscription found for user ${user._id}`);
                }
            }
        }
    } catch (error) {
        console.error("❌ Error sending notification:", error.message);
    }
};

module.exports = { sendNotification };
