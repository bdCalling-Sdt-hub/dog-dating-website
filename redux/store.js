import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice"; // Import your auth slice
import chatReducer from "./slices/chatSlice"; // Import your auth slice
import { baseApi } from "./api/baseApi";
import { persistStore, persistReducer } from "redux-persist";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Handle storage creation for SSR
const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    },
  };
};

const storage =
  typeof window === "undefined"
    ? createNoopStorage()
    : createWebStorage("local");

// Configuration for persisting only the accessToken from authSlice
const persistConfig = {
  key: "woof-spot",
  storage,
  whitelist: ["auth"], // Persist only the accessToken
  blacklist: ["baseApi"], // Don't persist userInfo
};

const rootReducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  chat: chatReducer,
  auth: authReducer, // Regular auth reducer (will be persisted separately)
};

// Create persisted reducer for the auth slice
const persistedReducer = persistReducer(
  persistConfig,
  combineReducers(rootReducer)
);

// Configure store with persisted authReducer and baseApi reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(baseApi.middleware), // Add baseApi middleware
});

// Create persistor
export const persistor = persistStore(store);
