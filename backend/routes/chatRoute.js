const express = require("express")
// const { addMessage, allMessages, sendFile } = require("../controllers/chatController")
const { isAuthenticated } = require("../middleWare/auth")
const { uploadAWS } = require("../middleWare/awsUpload")
const { addMessage, getMessages } = require("../controllers/chatController");
const router = express.Router()

// router.route("/addMessage").post(isAuthenticated,uploadAWS,addMessage)   
// router.route("/messages/:id").get(isAuthenticated,allMessages)
// router.route("/attachments").post(isAuthenticated, uploadAWS,sendFile)

// router.route("/attachments").post(isAuthenticated, uploadAWS.single('image'),sendFile)


router.route("/messages").post(isAuthenticated, addMessage);
router.route("/messages/:id").get(isAuthenticated, getMessages);





module.exports = router