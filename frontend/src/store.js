// src/store.js

/**
 * 🏪 REDUX STORE - Central data warehouse
 *
 * NEW: Uses configureStore from Redux Toolkit
 * MUCH simpler than the old createStore + middleware setup!
 */

import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./features/cart/cartSlice";
import userReducer from "./features/user/userSlice";
import productReducer from "./features/products/productSlice";
import orderReducer from "./features/orders/orderSlice";

/**
 * 🎯 Configure the Store
 *
 * configureStore automatically:
 * 1. Sets up Redux DevTools
 * 2. Adds thunk middleware
 * 3. Enables immutable state checks
 * 4. Combines reducers for us
 *
 * It replaces ALL of this old code:
 *
 * const reducer = combineReducers({ ... });
 * const middleware = [thunk];
 * const store = createStore(
 *   reducer,
 *   initialState,
 *   composeWithDevTools(applyMiddleware(...middleware))
 * );
 */

const store = configureStore({
  reducer: {
    // Each key becomes a slice of state
    cart: cartReducer,
    user: userReducer,
    products: productReducer,
    orders: orderReducer,
  },
  // 🎯 Optional: Customize middleware
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware(),

  // 🎯 Optional: Enable Redux DevTools
  // devTools: process.env.NODE_ENV !== 'production',
});

export default store;
