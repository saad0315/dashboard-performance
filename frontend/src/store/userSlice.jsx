import { createSlice } from "@reduxjs/toolkit";
import i18next from "i18next";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")),
  // token: JSON.parse(localStorage.getItem('token')),
  isAuthenticated: JSON.parse(localStorage.getItem("user")) ? true : false,
  locked: localStorage.getItem("token") ? false : true,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    setUser(state, action) {
      state.locked = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
    logoutRequest(state) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("selectedPackage");
      sessionStorage.removeItem("hasRegistered");
      state.user = null;
      state.isAuthenticated = false;
    },
    lockedRequest(state) {
      localStorage.removeItem("token");
      state.locked = true;
    },
    unLockedRequest(state, action) {
      state.locked = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { setUser, logoutRequest, lockedRequest, unLockedRequest } =
  userSlice.actions;

export default userSlice.reducer;
