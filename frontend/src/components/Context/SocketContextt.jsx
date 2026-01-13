
// import React from "react";
// import socketio from "socket.io-client";
// import { WEB_URL } from "../../constants/constants";

// export const socket = socketio.connect(WEB_URL);
// export const SocketContext = React.createContext();


import React, { createContext, useEffect, useState, useContext } from "react";
import { io } from "socket.io-client";
import { WEB_URL } from "../../constants/constants";
import { useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const queryClient = useQueryClient();
    const [socket, setSocket] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [messagesCount, setMessagesCount] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const { user } = useSelector((state) => state.user);

    useEffect(() => {
        if (!user?._id) return; // 🚀 Only connect if user is logged in

        const newSocket = io(WEB_URL, {
            transports: ["websocket", "polling"],
            query: { userId: user?._id } // Ensure transport works
        });

        // console.log("New Socket Instance:", newSocket); // Debugging ke liye
        setSocket(newSocket);


        newSocket.on("connect", () => {
            // console.log("✅ Connected to WebSocket");
        });


        newSocket.on("receiveNotification", (notification) => {
            // console.log("🔔 Notification received:", notification);
            setNotifications((prev) => [notification, ...prev]);
            queryClient.invalidateQueries(["notifications"]);
        });

        newSocket.on("getOnlineUsers", (users) => {
            // console.log("🟢 Online Users:", users);
            setOnlineUsers(users);
        });

        // newSocket.on("receiveMessage", (messages) => {
        //     console.log("📩 Messages received:", messages);
        //     setMessagesCount(messages);
        // })

        return () => newSocket.disconnect();
    }, [user?._id]);

    return (
        <SocketContext.Provider value={{ socket, notifications, messagesCount, setNotifications,  onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(SocketContext);
};