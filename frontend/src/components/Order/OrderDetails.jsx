// src/components/Order/OrderDetails.jsx

/**
 * 📋 ORDER DETAILS - View specific order details
 *
 * Features:
 * 1. Order information (ID, date, status)
 * 2. Shipping information
 * 3. Payment status
 * 4. Order items list
 * 5. Order summary with totals
 *
 * 📦 Packages Used:
 * - react-hot-toast: v2+ (toast notifications)
 * - framer-motion: v9+ (animations)
 * - react-icons: v4+ (icons)
 * - react-router-dom: v6 (navigation)
 *
 * 🔄 Redux Toolkit:
 * - orderSlice: getOrderDetails, clearOrderErrors
 */

import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  FaTruck,
  FaCreditCard,
  FaShoppingBag,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaArrowLeft,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Chip, CircularProgress } from "@mui/material";

// ✅ Redux Toolkit imports
import {
  getOrderDetails,
  clearOrderErrors,
  selectOrderDetails,
  selectOrderDetailsLoading,
  selectOrderDetailsError,
} from "../../features/orders/orderSlice";

import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";

const OrderDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // 📊 Redux state
  const order = useSelector(selectOrderDetails);
  const loading = useSelector(selectOrderDetailsLoading);
  const error = useSelector(selectOrderDetailsError);

  /**
   * 🎨 Get status chip
   */
  const getStatusChip = (status) => {
    const statusMap = {
      Delivered: {
        color: "success",
        icon: <FaCheckCircle className="text-green-500" />,
        label: "Delivered",
      },
      Processing: {
        color: "warning",
        icon: <FaClock className="text-yellow-500" />,
        label: "Processing",
      },
      Shipped: {
        color: "info",
        icon: <FaTruck className="text-blue-500" />,
        label: "Shipped",
      },
      Cancelled: {
        color: "error",
        icon: <FaTimesCircle className="text-red-500" />,
        label: "Cancelled",
      },
    };
    return (
      statusMap[status] || {
        color: "default",
        icon: <FaClock className="text-gray-500" />,
        label: status,
      }
    );
  };

  /**
   * 📅 Format date
   */
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /**
   * 📍 Format address
   */
  const formatAddress = (shippingInfo) => {
    if (!shippingInfo) return "N/A";
    return `${shippingInfo.address || ""}, ${shippingInfo.city || ""}, ${shippingInfo.state || ""}, ${shippingInfo.pinCode || ""}, ${shippingInfo.country || ""}`;
  };

  // 🔄 Effects
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearOrderErrors());
    }
    dispatch(getOrderDetails(id));
  }, [dispatch, id, error]);

  // ⏳ Loading state
  if (loading) return <Loader />;

  // 🚫 No order found
  if (!order || !order._id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-700">Order Not Found</h2>
          <p className="text-gray-500 mb-6">
            The order you're looking for doesn't exist.
          </p>
          <Link
            to="/orders"
            className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
          >
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  // 📊 Get order totals
  const subtotal =
    order.orderItems?.reduce(
      (acc, item) => acc + item.quantity * item.price,
      0,
    ) || 0;

  const statusInfo = getStatusChip(order.orderStatus);

  return (
    <Fragment>
      <MetaData title={`Order #${order._id?.slice(-8)} | ECOMMERCE`} />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* 🔙 Back Button */}
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors mb-6"
          >
            <FaArrowLeft />
            <span>Back to Orders</span>
          </Link>

          {/* 🏷️ Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-xl p-6 mb-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Order #{order._id?.slice(-8).toUpperCase()}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <Chip
                    icon={statusInfo.icon}
                    label={statusInfo.label}
                    color={statusInfo.color}
                    sx={{ fontWeight: "medium" }}
                  />
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <FaCalendarAlt className="text-xs" />
                    {formatDate(order.createdAt)}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-2xl font-bold text-red-500">
                  ₹{order.totalPrice?.toFixed(2)}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 📝 Left: Order Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* 📦 Shipping Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <FaTruck className="text-red-500" />
                  Shipping Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <FaUser className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium">{order.user?.name || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaPhone className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="font-medium">
                        {order.shippingInfo?.phoneNo || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="font-medium">
                        {formatAddress(order.shippingInfo)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* 💳 Payment Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <FaCreditCard className="text-red-500" />
                  Payment Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <Chip
                      label={
                        order.paymentInfo?.status === "succeeded"
                          ? "Paid"
                          : "Not Paid"
                      }
                      color={
                        order.paymentInfo?.status === "succeeded"
                          ? "success"
                          : "error"
                      }
                      size="small"
                      sx={{ mt: 1, fontWeight: "medium" }}
                    />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount Paid</p>
                    <p className="text-lg font-semibold text-red-500">
                      ₹{order.totalPrice?.toFixed(2)}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* 🛒 Order Items */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl p-6"
              >
                <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                  <FaShoppingBag className="text-red-500" />
                  Order Items ({order.orderItems?.length || 0})
                </h3>

                <div className="space-y-4">
                  {order.orderItems?.map((item) => (
                    <div
                      key={item.product}
                      className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <Link
                          to={`/product/${item.product}`}
                          className="font-medium text-gray-800 hover:text-red-500 transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                      <p className="font-semibold text-red-500">
                        ₹{(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* 💰 Right: Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                <h3 className="text-xl font-bold mb-6 border-b pb-4">
                  Order Summary
                </h3>

                <div className="space-y-3">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span
                      className={
                        order.shippingPrice === 0 ? "text-green-600" : ""
                      }
                    >
                      {order.shippingPrice === 0
                        ? "Free"
                        : `₹${order.shippingPrice?.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 border-b pb-3">
                    <span>Tax (18% GST)</span>
                    <span>₹{order.taxPrice?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2">
                    <span>Total</span>
                    <span className="text-red-500">
                      ₹{order.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Order Status Timeline (Optional) */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 font-medium mb-3">
                    Order Status
                  </p>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        order.orderStatus === "Delivered"
                          ? "bg-green-500"
                          : order.orderStatus === "Processing"
                            ? "bg-yellow-500"
                            : order.orderStatus === "Shipped"
                              ? "bg-blue-500"
                              : "bg-red-500"
                      }`}
                    />
                    <span className="font-medium capitalize">
                      {order.orderStatus || "Processing"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default OrderDetails;
