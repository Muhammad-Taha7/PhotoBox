// store.js
import { configureStore } from "@reduxjs/toolkit";
import imageReducer from "./Slices/APiDataSlice";

export const Store = configureStore({
  reducer: {
    images:imageReducer,
  },
});
