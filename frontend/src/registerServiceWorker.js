import { BASE_URL } from "./constants/constants";
import { logoutRequest } from "./store/userSlice";

const PUBLIC_VAPID_KEY = "BO8u-u_WWb_fDCWY41zSH4p6DPS-IRX8DeqayN9cJyW-4g23ouY3-d9DTOEHKEZ25MYlBsFEloNfrWfdEk3_Tyw"; // 🔑 Apni actual public VAPID key yahan daalein

export async function registerServiceWorker(userId) {
    if (!("serviceWorker" in navigator)) {
        console.log("❌ Service workers are not supported");
        return;
    }

    try {
        // ✅ Service Worker Register Karna
        const register = await navigator.serviceWorker.register("/sw.js");

        // ✅ Push Notification Subscription Create Karna
        const subscription = await register.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: PUBLIC_VAPID_KEY,
        });


        // ✅ Subscription Backend Ko Bhejna
        await fetch(`${BASE_URL}subscribe`, {
            method: "POST",
            body: JSON.stringify({ userId, subscription }),
            headers: {
                "Content-Type": "application/json",
            },
        });

    } catch (error) {
        console.error("❌ Service Worker Registration Failed:", error);
    }
}


export async function handleLogout(userId, dispatch) {
    try {
        // Backend se subscription delete karna
        await fetch(`${BASE_URL}unsubscribe`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId })
        });

        // Service worker ki subscription bhi remove karni hogi
        if ("serviceWorker" in navigator) {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            // localStorage.removeItem("user");
            // localStorage.removeItem("token");
            // localStorage.removeItem("selectedPackage");
            // sessionStorage.removeItem("hasRegistered");  // ✅ Ensure API doesn't run after logout

            // state.isAuthenticated = false;
            if (subscription) {
                await subscription.unsubscribe();
            }
        }
        dispatch(logoutRequest());
    } catch (error) {
        console.error("❌ Error during logout:", error);
    }
}
