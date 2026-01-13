const express = require("express")
const router = express.Router()
// const { newChatRoom, getChatRoom, getAdminChats, assignChat, testChatRoom } = require("../controllers/chatRoomController")
const { isAuthenticated, authorizeRole } = require("../middleWare/auth")
// const { assignChat } = require("../controllers/chatRoomController")
const { createChatRoom , getUserChatRooms , newChatRoom , testChatRoom } = require("../controllers/chatRoomController")
// const {  } = require("../controllers/chatRoomController")

router.route("/chatRoomtest").post(isAuthenticated,newChatRoom)
router.route("/testChatRoom").get(isAuthenticated,testChatRoom)
// router.route("/getChatRoom").get(isAuthenticated,getChatRoom)
// router.route("/getAdminChats").get(isAuthenticated, authorizeRole('admin',"projectmanager"),getAdminChats)
// router.route("/assignChat").put(isAuthenticated, authorizeRole('admin'),assignChat)



router.route("/chatRoom").post(isAuthenticated, createChatRoom);
router.route("/chatRooms").get(isAuthenticated, getUserChatRooms);



module.exports = router