// import { Server } from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:3000"],
//   },
// });

// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// // used to store online users
// const userSocketMap = {}; // {userId: socketId}

// io.on("connection", (socket) => {
//   console.log("A user connected", socket.id);

//   const userId = socket.handshake.query.userId;
//   if (userId) userSocketMap[userId] = socket.id;

//   // io.emit() is used to send events to all the connected clients
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   socket.on("disconnect", () => {
//     console.log("A user disconnected", socket.id);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// export { io, app, server };



const { Server } = require("socket.io");

let io;
const userSocketMap = {}; // { userId: socketId }
let users = [];

// Function to add a user
const addUser = (userId, socketId) => {
  if (!userSocketMap[userId]) {
    userSocketMap[userId] = [];
  }
  if (!userSocketMap[userId].includes(socketId)) {
    userSocketMap[userId].push(socketId);
  }
};

// Function to remove a user
const removeUser = (socketId) => {
  for (const userId in userSocketMap) {
    userSocketMap[userId] = userSocketMap[userId].filter(id => id !== socketId);
    if (userSocketMap[userId].length === 0) {
      delete userSocketMap[userId];
    }
  }
};

// Function to get a specific user
const getUser = (userId) => {
  return userSocketMap.find((user) => user.userId === userId);
};

// Initialize Socket.io
const initializeSocket = (server) => {
  // console.log("Initializing Socket.IO...");

  io = new Server(server, {
    cors: {
      // origin: "https://ebook.madcomdigital.com",
      origin: [
        "http://localhost:3000",
        "https://ebook.madcomdigital.com",
        "http://203.161.60.4:3000",
      ],
      methods: ["GET", "POST", "PUT", "DELETE"],
      transports: ["websocket", "polling"] // Ensure both transports are supported
    }
  });

  io.on("connection", (socket) => {
    console.log("CONNECTED SOCKET", socket.id);

    // Get userId from handshake query (recommended)
    const userId = socket.handshake.query.userId;

    // console.log("🔗 handshake query:", socket.handshake.query);
    // console.log("🔗 userId from handshake query:", userId);

    if (!userId || userId === "undefined" || userId === "null") {
      console.log("⚠️ Invalid userId received! Disconnecting socket:", socket.id);
      socket.disconnect(); // 🔥 Prevents "undefined" or "null" users from being stored
      return;
    }

    // console.log("✅ CONNECTED SOCKET:", socket.id, "for user:", userId);

    if (!userSocketMap[userId]) userSocketMap[userId] = [];
    userSocketMap[userId].push(socket.id);

    console.log("🔄 Updated userSocketMap:", userSocketMap);

    // Emit the list of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Handle sending messages
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
      const user = getUser(receiverId);
      if (user) {
        io.to(user.socketId).emit("getMessage", { senderId, text, receiverId });
        // console.log("📤 sendMessage:", { senderId, receiverId, text });
      }
    });

    // Handle assigning chat
    socket.on("assignChat", ({ representative, receiverId }) => {
      const user = getUser(receiverId);
      if (user) {
        io.to(user.socketId).emit("assignChatNotification", { representative });
      }
    });
    // setTimeout(() => {
    //   console.log("📢 Sending test notification...");
    //   io.emit("receiveNotification", {
    //     type: "TEST",
    //     content: "This is a test notification from backend"
    //   });
    // }, 5000);

    // Handle disconnection
    socket.on("disconnect", () => {
      // console.log("A User Disconnected", socket.id);
      removeUser(socket.id);
      // Remove from userSocketMap
      for (let userId in userSocketMap) {
        if (userSocketMap[userId] === socket.id) {
          delete userSocketMap[userId];
        }
      }
      io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
  });
  // console.log("Socket.IO initialized successfully!");
  return io;
};

// Get the initialized io instance
const getSocketIO = () => {
  if (!io) {
    console.error("❌ Socket.io is NOT initialized yet!");
    throw new Error("Socket.io not initialized");
  }
  // console.log("✅ getSocketIO() called successfully");
  return io;
};

module.exports = { initializeSocket, getSocketIO, userSocketMap };

