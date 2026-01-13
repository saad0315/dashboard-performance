// self.addEventListener("push", (event) => {
//     const data = event.data.json();
//     self.registration.showNotification(data.title, {
//         body:  data.body,
//         icon: "https://madcomdigital.com/assets/images/fevicon.png", // Change this to your app's logo
        
//     });
// });

self.addEventListener("push", (event) => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: "https://ebook.sentracoresystems.com/favicon.png",
        data: { url: data.url }, // Store the redirect URL inside data
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
    event.notification.close(); // Close the notification

    const urlToOpen = event.notification.data?.url || "/"; // Default URL if none provided

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
            for (let client of clientList) {
                if (client.url === urlToOpen && "focus" in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
