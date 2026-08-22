// src/features/cart/cartSlice.js

/**
 * 🎯 CART SLICE - Manages shopping cart state
 * 
 * This is like the "Shopping Cart Department" in our warehouse
 * It handles everything related to what users add to their cart
 * 
 * 📚 WHAT THIS FILE DOES (In Simple Terms):
 * 1. Remembers what items are in the cart
 * 2. Remembers shipping address
 * 3. Saves cart to localStorage (so items don't disappear on refresh)
 * 4. Provides functions to add, remove, and update items
 * 
 * 🔄 REPLACES 3 OLD FILES:
 * - constants/cartConstants.js (Action names like "ADD_TO_CART")
 * - actions/cartAction.js (What to do)
 * - reducers/cartReducer.js (How to update state)
 * 
 * With Redux Toolkit, we put ALL of this in ONE file!
 */

// 📦 STEP 1: Import dependencies
// createSlice is the main tool - it creates our "department"
import { createSlice } from "@reduxjs/toolkit";

/**
 * 🏪 STEP 2: Define Initial State
 * 
 * This is the "starting inventory" of our cart department
 * 
 * ❓ Why do we check localStorage?
 *    When user adds items and refreshes page, we want them to stay
 *    localStorage is like a "sticky note" that remembers things
 * 
 * ❓ What does JSON.parse do?
 *    localStorage stores text, but our data is objects
 *    JSON.parse converts text back to objects
 *    JSON.stringify converts objects to text
 */
const initialState = {
  // 🛒 Cart Items - Products user has added
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems")) // If exists, use it
    : [], // If not, start empty
  
  // 📦 Shipping Info - Where to deliver
  shippingInfo: localStorage.getItem("shippingInfo")
    ? JSON.parse(localStorage.getItem("shippingInfo")) // If exists, use it
    : {}, // If not, start empty
};

/**
 * 🎨 STEP 3: Create the Cart Slice
 * 
 * Think of createSlice as a "department factory"
 * It creates:
 * 1. Actions (like "ADD_TO_CART") - The work orders
 * 2. Reducers (how to handle those actions) - The workers
 * 3. Selectors (how to get data) - The receptionists
 * 
 * 🎯 Why is this better than old Redux?
 *    Old Redux: 3 files, 200+ lines, confusing
 *    Redux Toolkit: 1 file, clean, easy to understand
 */
const cartSlice = createSlice({
  // 📛 Name: Every slice needs a name
  // This becomes the action prefix: 'cart/addToCart'
  name: "cart",
  
  // 📋 Initial State: What we defined above
  initialState,
  
  // 🔧 Reducers: These are the "workers" that handle actions
  // Each reducer is like a specific job:
  // - "Add this item to cart"
  // - "Remove this item from cart"
  // - "Save shipping address"
  reducers: {
    
    /**
     * ➕ ADD TO CART - "Add this product to the cart"
     * 
     * @param {Object} state - Current cart data (we can mutate it!)
     * @param {Object} action - Contains the item to add
     * 
     * ❓ WHY CAN WE MUTATE (change) STATE DIRECTLY?
     *    In old Redux, we couldn't mutate state
     *    We had to use spread operators like: 
     *    {...state, cartItems: [...state.cartItems, item]}
     *    
     *    But Redux Toolkit uses Immer (a library) behind the scenes
     *    Immer lets us write "mutating" code
     *    But actually creates immutable updates automatically!
     *    
     *    Example: state.cartItems.push(item) ← Looks like mutation
     *    But Immer converts it to: {...state, cartItems: [...state.cartItems, item]}
     *    Automatically! We don't have to worry about it!
     */
    addToCart: (state, action) => {
      // 📦 Get the item we want to add
      const item = action.payload;
      
      // 🔍 Check if this product already exists in cart
      // We find by product ID (each product has unique _id)
      const isItemExist = state.cartItems.find(
        (i) => i.product === item.product
      );

      if (isItemExist) {
        // ✅ Product exists - Update quantity
        // Example: User already has 2 iPhones, now they want 3
        // We replace the existing item with the updated one
        state.cartItems = state.cartItems.map((i) =>
          i.product === isItemExist.product ? item : i
        );
      } else {
        // ✅ Product doesn't exist - Add new item
        // Example: User adds iPhone for first time
        // We push it to the array (allowed with Immer!)
        state.cartItems.push(item);
      }

      // 💾 Save to localStorage so it persists
      // localStorage.setItem("key", "value")
      // We store as text (JSON.stringify converts object to text)
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    /**
     * ❌ REMOVE FROM CART - "Delete this item from cart"
     * 
     * @param {Object} state - Current cart state
     * @param {Object} action - Contains the product ID to remove
     */
    removeFromCart: (state, action) => {
      // 🗑️ Filter out the item with matching product ID
      // .filter() creates a new array without the removed item
      // Example: cartItems = [iphone, shoes, bag]
      // Remove 'shoes' → cartItems = [iphone, bag]
      state.cartItems = state.cartItems.filter(
        (i) => i.product !== action.payload
      );

      // 💾 Update localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    /**
     * 📦 SAVE SHIPPING INFO - "Store the delivery address"
     * 
     * @param {Object} state - Current cart state
     * @param {Object} action - Contains shipping address data
     */
    saveShippingInfo: (state, action) => {
      // 📝 Update shipping info with the new data
      state.shippingInfo = action.payload;

      // 💾 Save to localStorage
      localStorage.setItem("shippingInfo", JSON.stringify(action.payload));
    },

    /**
     * 🗑️ CLEAR CART - "Empty the cart"
     * 
     * Used after order is placed successfully
     * Clears everything so user starts fresh
     */
    clearCart: (state) => {
      // 🧹 Empty the cart
      state.cartItems = [];
      // 🗑️ Remove from localStorage
      localStorage.removeItem("cartItems");
    },
  },
});

/**
 * 📤 STEP 4: Export Actions
 * 
 * These are the "work orders" we use in components
 * 
 * ❓ How do we use these in components?
 *    Example: dispatch(addToCart(product))
 *    
 *    This tells Redux: "Hey, run the addToCart reducer with this product"
 * 
 * 💡 Naming Convention:
 *    Actions are camelCase (addToCart, removeFromCart)
 *    Reducers have the same names (they're linked!)
 */
export const { 
  addToCart, 
  removeFromCart, 
  saveShippingInfo, 
  clearCart 
} = cartSlice.actions;

/**
 * 📤 STEP 5: Export Selectors
 * 
 * Selectors are like "receptionists" at the front desk
 * They know exactly where to find specific data in the store
 * 
 * ❓ Why use selectors?
 *    1. Cleaner code: No more `state.cart.cartItems` everywhere
 *    2. Reusable: Same selector anywhere in app
 *    3. Maintainable: If state structure changes, update only selector
 * 
 * ❓ How to use in components?
 *    const cartItems = useSelector(selectCartItems);
 *    This gets the cart items from the store
 * 
 * 💡 Naming Convention:
 *    Selectors start with "select" prefix
 *    Example: selectCartItems, selectShippingInfo
 */
export const selectCartItems = (state) => state.cart.cartItems;
export const selectShippingInfo = (state) => state.cart.shippingInfo;
export const selectCartTotal = (state) =>
  state.cart.cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
export const selectCartItemsCount = (state) =>
  state.cart.cartItems.reduce((count, item) => count + item.quantity, 0);

/**
 * 📤 STEP 6: Export Reducer
 * 
 * The reducer is the "worker" that does the actual work
 * This gets added to the store
 * 
 * ❓ What is a reducer?
 *    A function that takes current state and an action
 *    Returns the new state (after processing the action)
 * 
 * 💡 The reducer is automatically generated by createSlice!
 *    We just export it: cartSlice.reducer
 */
export default cartSlice.reducer;