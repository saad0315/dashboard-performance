const express = require("express")
const { isAuthenticated, authorizeRole } = require("../middleWare/auth")
const { createOrders, getOrders } = require("../controllers/orderController")
const router = express.Router()

router.route("/order").post(isAuthenticated,createOrders).get(getOrders)
// router.route("/messages/:id").get(isAuthentic`ated,allMessages)

module.exports = router