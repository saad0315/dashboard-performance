const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "config/config.env"),
});

const app = require("./app")
// const dotenv = require("dotenv")
const { db1, db2 } = require("./config/db");
const { initializeSocket } = require("./utils/socket");
// dotenv.config({ path: "./config/config.env" })
const http = require("http");
const { startPerformanceWatchers } = require("./utils/performanceWatcher");
const server = http.createServer(app); // Create the HTTP server


initializeSocket(server);

// ✅ Start Change Stream Watchers once db is connected
db1.on("connected", () => {
    console.log("🧠 Starting performance watchers...");
    startPerformanceWatchers(db1);
});

server.listen(process.env.PORT, '0.0.0.0', () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
})


// let user = []
// const addUser = (userId, socketId) => {
//     !user.some(user => user.userId === userId) &&
//         user.push({ userId, socketId })
// }
// const removeUser = (socketId) => {
//     user = user.filter(user => user.socketId !== socketId)
// }
// const getUser = (userId) => {
//     return user.find(user => user.userId === userId)
// }
// const getData =  async()=>{
//     // console.log(a);
//     const user = await User.find()
//     if(!user){
//         return "nothing"
//     }

//     return user    
// }
// console.log("saif");
// 
////////////////////////////////////////////////
// const userSocketMap = {}; // {userId: socketId}

// io.on("connection", async (socket) => {
//     console.log("CONNECTED SOCKET");
//     //  const w = await getData();
//     socket.on("addUser", (userId) => {
//         addUser(userId, socket.id)
//         console.log(user);
//         // io.emit("getUsers", user)
//     })
//     const userId = socket.handshake.query.userId;
//     if (userId) userSocketMap[userId] = socket.id;

//     // io.emit() is used to send events to all the connected clients
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));

//     socket.on("sendMessage", ({ senderId, receiverId, text, }) => {
//         const user = getUser(receiverId)
//         io.to(user?.socketId).emit("getMessage", {
//             senderId,
//             text,
//             receiverId,
//         })
//     })
//     socket.on('assignChat', ({ representative, receiverId, conversationId }) => {
//         const user = getUser(receiverId)
//         console.log(representative);
//         io.to(user?.socketId).emit('assignChatNotification', {
//             representative,
//         })
//     })
//     //
//     socket.on("disconnect", () => {
//         console.log("A User Disconnected")
//         removeUser(socket.id)
//         // io.emit("getUsers", user)
//     })
// })

// syncFormToLead()

process.on("unhandledRejection", err => {
    console.log(`Error : ${err.message}`);
    console.log("Shutting down");
    server.close(() => {
        process.exit(1)
    })

})
process.on("uncaughtException", (err) => {
    console.log(`Error : ${err.message}`);
    console.log("Shutting Down");
    server.close(() => {
        process.exit(1)
    })
})
