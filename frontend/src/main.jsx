// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast"; // ✅ Modern toast notification
import store from "./store";
import App from "./App";
import "./index.css"; // ✅ Tailwind CSS

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <HelmetProvider>
      <App />
      {/* ✅ Toast notifications - works everywhere */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
            padding: "16px",
            borderRadius: "10px",
          },
          success: {
            duration: 3000,
            style: {
              background: "#22c55e",
              color: "#fff",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#ef4444",
              color: "#fff",
            },
          },
        }}
      />
    </HelmetProvider>
  </Provider>,
);
