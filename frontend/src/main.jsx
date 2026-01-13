import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";

// Perfect Scrollbar
import "react-perfect-scrollbar/dist/css/styles.css";

import '@mantine/core/styles.css';
import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';


// Tailwind css
import "./tailwind.css";

// i18n (needs to be bundled)
import "./i18n";

// Router
import { RouterProvider } from "react-router-dom";
import router from "./router/index";

// Redux
import { Provider } from "react-redux";
import store from "./store/index";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { SocketProvider } from "./components/Context/SocketContextt";
import { MantineProvider } from "@mantine/core";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 5,
      retryDelay: 1000,
    },
  },
});
// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker.register("/sw.js")
//     .then(reg => console.log("Service Worker Registered!", reg))
//     .catch(err => console.error("Service Worker Registration Failed:", err));
// }

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense>
      <MantineProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            {/* <SocketContext.Provider value={{ socket }}> */}
            {/* <SocketProvider> */}
              <RouterProvider router={router} />
              <ReactQueryDevtools initialIsOpen={false} />
            {/* </SocketProvider> */}
            {/* </SocketContext.Provider > */}
          </QueryClientProvider>
        </Provider>
      </MantineProvider>
    </Suspense>
  </React.StrictMode>
);
