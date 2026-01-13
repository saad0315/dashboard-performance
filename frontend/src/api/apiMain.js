// import axios from "axios";
// import { BASE_URL } from "../constants/constants";

// const token = localStorage.getItem("token");

// const headers = {
//   "Content-Type": "application/json",
// };

// if (token) {
//   headers.Authorization = `Bearer ${token}`;
// }

// const apiMain = axios.create({
//   baseURL: BASE_URL,
//   headers,
// });

// export default apiMain;

import axios from "axios";
import { BASE_URL } from "../constants/constants";

const apiMain = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor
apiMain.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiMain;
