// src/store.js

/**
 * 🏪 REDUX STORE - Central data warehouse
 *
 * This is the "brain" of our app's state management
 * All data flows through here
 *
 * 🌟 THINK OF IT LIKE:
 *    - Store = The central database for our React app
 *    - Reducers = Different departments managing different data
 *    - State = The actual data stored
 *
 * 📦 PACKAGES USED:
 *    - @reduxjs/toolkit: Modern Redux setup
 *    - We DON'T need redux, redux-thunk, or redux-devtools-extension
 *    - configureStore includes all of these automatically!
 *
 * 🔄 REPLACES OLD CODE:
 *    Before (Old Redux):
 *    - combineReducers() → manual combining
 *    - createStore() → manual store creation
 *    - applyMiddleware(thunk) → manual middleware setup
 *    - composeWithDevTools() → manual devtools setup
 *
 *    Now (Redux Toolkit):
 *    - configureStore() → Does EVERYTHING automatically! 🎉
 */

import { configureStore } from "@reduxjs/toolkit";

/**
 * 📦 Import All Reducers (Slices)
 *
 * These are the "department managers" for different parts of our app
 * Each one handles a specific domain:
 *    - cartReducer: Shopping cart data
 *    - userReducer: User authentication & profile
 *    - productReducer: Products, reviews, admin product management
 *    - orderReducer: Orders, order history, admin order management
 *
 * ❓ Why separate reducers?
 *    - Each handles one domain (separation of concerns)
 *    - Easier to maintain and debug
 *    - Can be developed independently
 *    - Better performance (only updates what changed)
 */
import cartReducer from "./features/cart/cartSlice";
import userReducer from "./features/user/userSlice";
import productReducer from "./features/products/productSlice";
import orderReducer from "./features/orders/orderSlice";

/**
 * 🎯 Configure the Store
 *
 * This is where we create the actual store
 *
 * ❓ What does configureStore do?
 *    1. ✅ Sets up Redux DevTools (automatically)
 *    2. ✅ Adds thunk middleware (for async actions)
 *    3. ✅ Enables immutable state checks (prevents bugs)
 *    4. ✅ Combines reducers (no need for combineReducers)
 *    5. ✅ Adds redux-logger in development (optional)
 *
 * 🎨 The reducer object:
 *    Each key becomes a "slice" of the state
 *    Example: state.cart, state.user, state.products, state.orders
 *
 * 📊 Final State Structure:
 *    {
 *      cart: { cartItems: [...], shippingInfo: {...} },
 *      user: { user: {...}, isAuthenticated: false, ... },
 *      products: { products: [...], product: {...}, ... },
 *      orders: { myOrders: [...], allOrders: [...], ... }
 *    }
 *
 * 💡 IMPORTANT: Order doesn't matter!
 *    Redux doesn't care about the order of reducers
 *    Each reducer only sees its own slice of state
 */
const store = configureStore({
  reducer: {
    // Each key becomes a slice of state
    cart: cartReducer, // Shopping cart state
    user: userReducer, // User authentication state
    products: productReducer, // Products & reviews state
    orders: orderReducer, // Orders state
  },
  /**
   * 🔧 Optional: Customize middleware
   *
   * If you need to add custom middleware:
   * middleware: (getDefaultMiddleware) =>
   *   getDefaultMiddleware().concat(myCustomMiddleware)
   *
   * But the defaults are perfect for most apps!
   */
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware(),

  /**
   * 🛠️ Optional: Enable/Disable DevTools
   *
   * By default, DevTools are enabled in development
   * You can explicitly control it:
   * devTools: process.env.NODE_ENV !== 'production'
   *
   * This prevents users from seeing Redux state in production
   */
  // devTools: process.env.NODE_ENV !== 'production',
});

/**
 * 📤 Export the Store
 *
 * This is what we import in main.jsx
 * The Provider uses this to give components access to the store
 */
export default store;
