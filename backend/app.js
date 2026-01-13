const express = require("express")
const app = express()
require('text-encoding')
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleWare/error")
const user = require("./routes/userRoute")
const bodyParser = require('body-parser');
const cors = require('cors')
const chat = require("./routes/chatRoute")
const chatroom = require("./routes/chatRoomRoute")
const package = require('./routes/packageRoute')
const order = require('./routes/orderRoute')
const organization = require('./routes/organizationRoute')
const lead = require('./routes/leadRoute')
const ccListRoute = require('./routes/ccListRoute')
const sales = require('./routes/salesRoute')
const invoices = require('./routes/invoiceRoute')
const teams = require('./routes/teamRoute')
const expense = require('./routes/expenseRoute')
const messages = require('./routes/messageRoute')
const forms = require('./routes/formsRoute')
const cardInfo = require('./routes/cardInfoRoute')
const notifications = require('./routes/notificationRoute')
const webpushRoutes = require('./routes/webpushRoutes')
const authorizeWebhookRoute = require('./routes/authorizeWebhook')
const paymentRoute = require('./routes/paymentRoute')
const performanceRoute = require('./routes/performanceRoute')
const dashboardRoute = require('./routes/dashboardRoute')

app.set('trust proxy', true)
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // Optional: customize view path

// app.use("/api/v1/authorize-webhook", bodyParser.raw({ type: '*/*' }));

app.use(express.json())
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())



app.use("/api/v1", user)
app.use("/api/v1", chatroom)
app.use("/api/v1", chat)
app.use("/api/v1", package)
app.use("/api/v1", order)
app.use("/api/v1", organization)
app.use("/api/v1", lead)
app.use("/api/v1", ccListRoute)
app.use("/api/v1", sales)
app.use("/api/v1", invoices)
app.use("/api/v1", teams)
app.use("/api/v1", expense)
app.use("/api/v1", messages)
app.use("/api/v1", forms)
app.use("/api/v1", cardInfo)
app.use("/api/v1", notifications)
app.use("/api/v1", webpushRoutes)
app.use("/api/v1", authorizeWebhookRoute)
app.use("/api/v1", paymentRoute)
app.use("/api/v1", performanceRoute)
app.use("/api/v1", dashboardRoute)

app.use(errorMiddleware)

module.exports = app;