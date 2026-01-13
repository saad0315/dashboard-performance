const express = require("express")
const { getMessages, sendMessage, getUsersForSidebar, adminGetAllChats, adminGetUserChats, adminGetUsersForSidebar, adminGetChatUsers, markMessageSeen } = require("../controllers/messageController")
const { isAuthenticated, authorizeRole } = require("../middleWare/auth");
const { uploadAWSSingle } = require("../middleWare/awsUpload");

const router = express.Router();

// router.get("/sidebarusers", protectRoute, getUsersForSidebar);
router.route("/sidebarusers").get(isAuthenticated, getUsersForSidebar);
router.route("/newmessages/:id").get(isAuthenticated, getMessages);
router.route("/newsend").post(isAuthenticated, uploadAWSSingle("message-files/") ,sendMessage);
router.route("/mark-message-seen").post(isAuthenticated, markMessageSeen);

router.route("/admin/chats").get(isAuthenticated, authorizeRole("admin"), adminGetAllChats);
router.route("/admin/sidebarusers").get(isAuthenticated, authorizeRole("admin"), adminGetChatUsers);
router.route("/admin/userchats/:user1Id/:user2Id").get(isAuthenticated, authorizeRole("admin"), adminGetUserChats);



// router.route("/messages").post(isAuthenticated, addMessage);
// router.route("/messages/:id").get(isAuthenticated, getMessages);





module.exports = router