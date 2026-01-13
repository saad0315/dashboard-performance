import apiMain from "./apiMain";

export const getNotification = async () => {
    const response = await apiMain.get("/notifications");
    return response.data;
};
// Delete a notification
export const deleteNotification = async (id) => {
    const response = await apiMain.delete(`/notifications/${id}`);
    return response.data;
};

// Mark a notification as read
export const markAsRead = async (notificationId) => {
    const response = await apiMain.put(`/notifications/read/${notificationId}`);
    return response.data;
};

// Mark all notifications as read
export const markAllAsRead = async () => {
    const response = await apiMain.put(`/notifications/read-all`);
    return response.data;
};
