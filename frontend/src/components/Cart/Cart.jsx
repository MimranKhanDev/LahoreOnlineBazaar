// src/components/Cart/Cart.jsx

/**
 * 🛒 CART - Shopping cart page
 *
 * Features:
 * 1. Display cart items with image, name, price
 * 2. Quantity adjustment (increase/decrease)
 * 3. Remove items from cart
 * 4. Subtotal calculation
 * 5. Checkout button
 * 6. Empty cart state
 *
 * 📦 Packages Used:
 * - react-hot-toast: v2+ (toast notifications)
 * - framer-motion: v9+ (animations)
 * - react-router-dom: v6 (navigation)
 *
 * 🔄 Redux Toolkit:
 * - cartSlice: addToCart, removeFromCart
 */

import React, { Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaShoppingCart,
  FaTrash,
  FaPlus,
  FaMinus,
  FaArrowLeft,
} from "react-icons/fa";

// ✅ Redux Toolkit imports
import {
  addToCart,
  removeFromCart,
  selectCartItems,
  selectCartTotal,
  selectCartItemsCount,
} from "../../features/cart/cartSlice";

import CartItemCard from "./CartItemCard";
import MetaData from "../layout/MetaData";
import { Link } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 📊 Redux state
  const cartItems = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotal);
  const itemsCount = useSelector(selectCartItemsCount);

  /**
   * ➕ Increase quantity of an item
   */
  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (newQty > stock) {
      toast.error("Cannot add more than available stock");
      return;
    }
    // Find the item and update quantity
    const item = cartItems.find((i) => i.product === id);
    if (item) {
      dispatch(
        addToCart({
          ...item,
          quantity: newQty,
        }),
      );
    }
  };

  /**
   * ➖ Decrease quantity of an item
   */
  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (newQty < 1) return;
    const item = cartItems.find((i) => i.product === id);
    if (item) {
      dispatch(
        addToCart({
          ...item,
          quantity: newQty,
        }),
      );
    }
  };

  /**
   * 🗑️ Remove item from cart
   */
  const deleteCartItem = (id) => {
    dispatch(removeFromCart(id));
    toast.success("Item removed from cart");
  };

  /**
   * ✅ Proceed to checkout
   */
  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
  };

  return (
    <Fragment>
      <MetaData title="Shopping Cart | ECOMMERCE" />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* 🏷️ Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link
              to="/products"
              className="text-gray-500 hover:text-red-500 transition-colors"
            >
              <FaArrowLeft className="text-xl" />
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">
              Shopping <span className="text-red-500">Cart</span>
            </h1>
            {cartItems.length > 0 && (
              <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full">
                {itemsCount} items
              </span>
            )}
          </div>

          {/* 🛒 Cart Content */}
          {cartItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl p-12 text-center"
            >
              <FaShoppingCart className="text-7xl text-gray-300 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                Your Cart is Empty
              </h2>
              <p className="text-gray-500 mb-6">
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link
                to="/products"
                className="inline-block px-8 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Start Shopping
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 📋 Cart Items List - Left */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                  {/* Table Header */}
                  <div className="hidden md:grid grid-cols-12 gap-4 bg-gray-50 px-6 py-4 font-semibold text-gray-600">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-3 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                    <div className="col-span-1 text-center">Action</div>
                  </div>

                  {/* Cart Items */}
                  <AnimatePresence>
                    {cartItems.map((item, index) => (
                      <motion.div
                        key={item.product}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <CartItemCard
                          item={item}
                          deleteCartItem={deleteCartItem}
                          increaseQuantity={increaseQuantity}
                          decreaseQuantity={decreaseQuantity}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* 💰 Order Summary - Right */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-1"
              >
                <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                  <h3 className="text-xl font-bold mb-6 border-b pb-4">
                    Order Summary
                  </h3>

                  <div className="space-y-4">
                    <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-gray-600 border-b pb-4">
                      <span>Tax (18% GST)</span>
                      <span>₹{(totalPrice * 0.18).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold pt-2">
                      <span>Total</span>
                      <span className="text-red-500">
                        ₹{(totalPrice + totalPrice * 0.18).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={checkoutHandler}
                    className="w-full mt-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Proceed to Checkout
                  </motion.button>

                  <p className="text-xs text-gray-400 text-center mt-4">
                    Taxes and shipping calculated at checkout
                  </p>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default Cart;
