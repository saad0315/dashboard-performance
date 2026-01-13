import { useState } from "react";
// import { useSocket } from "./components/Context/SocketContextt";
import { Link } from "react-router-dom";
import { getNotificationLink } from "./utils/Utils";

const NotificationPopup = () => {
    // const { notifications } = useContext(SocketContext);
    // const { notifications} = useSocket();
    const [visibleNotifications, setVisibleNotifications] = useState([]);
    // console.log("notifications", notifications)

    // useEffect(() => {
    //     if (notifications.length > 0) {
    //         setVisibleNotifications((prev) => [notifications[0], ...prev]);

    //         setTimeout(() => {
    //             setVisibleNotifications((prev) => prev.slice(1));
    //         }, 5000);
    //     }
    // }, [notifications]);


    return (
        <div className="fixed bottom-5 right-5 !z-[999999999] bg-[#fff] shadow-lg rounded-lg border-[1px] border-primary ">
            {visibleNotifications.map((notification, index) => (
                <Link to={getNotificationLink(notification?.type)} className="flex items-center p-4">
                    <img
                        className="object-cover w-12 h-12 rounded-lg"
                        // src="https://randomuser.me/api/portraits/men/71.jpg"
                        // src="https://res.cloudinary.com/ddvtgfqgv/image/upload/v1691059545/member-profile/avatar_aoyxl6.webp"
                        src="https://ebook.sentracoresystems.com/favicon.png"
                        alt=""
                    />

                    <div className="ml-3 overflow-hidden">
                        <p className="font-medium text-gray-900">{notification?.type}</p>
                        <p className="max-w-xs text-sm text-gray-500 truncate">
                            {notification?.content}
                        </p>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default NotificationPopup;
