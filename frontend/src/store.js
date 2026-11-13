import { configureStore } from "@reduxjs/toolkit";

import cartReducer from "./features/cart/cartSlice";
import userReducer from "./features/user/userSlice";
import productReducer from "./features/products/productSlice";
import orderReducer from "./features/orders/orderSlice";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    user: userReducer,
    products: productReducer,
    orders: orderReducer,
  },
});

export default store;
