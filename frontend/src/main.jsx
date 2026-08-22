// src/main.jsx

/**
 * 🚀 MAIN ENTRY POINT - Where our React app starts
 *
 * This file does 3 important things:
 * 1. Sets up React with ReactDOM
 * 2. Wraps the app with Redux Provider (for state management)
 * 3. Wraps the app with HelmetProvider (for SEO)
 * 4. Sets up Toast notifications (react-hot-toast)
 *
 * 🌟 THINK OF IT LIKE:
 *    - main.jsx = The "front door" of your app
 *    - Everything passes through here before going to App.jsx
 *
 * 📦 PACKAGES USED:
 *    - react: For creating the app
 *    - react-dom: For rendering to the browser
 *    - react-redux: For Redux state management
 *    - react-helmet-async: For SEO (page titles, meta tags)
 *    - react-hot-toast: For beautiful toast notifications
 */

import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "react-hot-toast"; // ✅ Modern toast notification
import store from "./store";
import App from "./App";
import "./index.css"; // ✅ Tailwind CSS

/**
 * 🎯 ReactDOM.createRoot()
 *
 * This is the new React 18+ way to render
 * It replaces the old ReactDOM.render()
 *
 * ❓ Why createRoot?
 *    - Enables React 18 features (concurrent rendering)
 *    - Better performance
 *    - Future-proof
 *
 * ❓ What is document.getElementById("root")?
 *    - Finds the HTML element with id="root"
 *    - This is where React will render our app
 *    - Defined in index.html
 */
ReactDOM.createRoot(document.getElementById("root")).render(
  /**
   * 🏪 Provider (from react-redux)
   *
   * This makes the Redux store available to ALL components
   * Any component can now use useSelector() and useDispatch()
   *
   * ❓ Why wrap everything?
   *    - So every component has access to Redux state
   *    - Without this, useSelector() would return undefined
   */
  <Provider store={store}>
    <HelmetProvider>
      {/* 🎯 The Main App Component */}
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000, // 4 seconds
          style: {
            background: "#333",
            color: "#fff",
            padding: "16px",
            borderRadius: "10px",
          },
          // ✅ Success messages - Green
          success: {
            duration: 3000,
            style: {
              background: "#22c55e", // Green
              color: "#fff",
            },
          },
          // ❌ Error messages - Red
          error: {
            duration: 4000,
            style: {
              background: "#ef4444", // Red
              color: "#fff",
            },
          },
        }}
      />
    </HelmetProvider>
  </Provider>,
);
