const webpush = require("web-push");

const publicVapidKey = "BO8u-u_WWb_fDCWY41zSH4p6DPS-IRX8DeqayN9cJyW-4g23ouY3-d9DTOEHKEZ25MYlBsFEloNfrWfdEk3_Tyw";
const privateVapidKey = "CZRayVyu0edEtMGDQDa22VMTKKpF1wuXUsclwcwswhQ";
    
webpush.setVapidDetails(
  "mailto:no-reply@yourdomain.com",
  publicVapidKey,
  privateVapidKey
);

const sendPushNotification = (subscription, payload) => {
  return webpush.sendNotification(subscription, JSON.stringify(payload))
    .catch(err => console.error("❌ Error sending push notification:", err));
};

module.exports = { sendPushNotification };
