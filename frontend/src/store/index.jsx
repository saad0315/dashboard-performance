import { combineReducers, configureStore } from "@reduxjs/toolkit";
import themeConfigSlice from "./themeConfigSlice";
import userSlice from "./userSlice";

const rootReducer = combineReducers({
  themeConfig: themeConfigSlice,
  user: userSlice,
});

export default configureStore({
  reducer: rootReducer,
});
