// src/components/Admin/ProcessOrder.jsx

/**
 * ⚙️ PROCESS ORDER - Update order status
 *
 * Features:
 * 1. Display order details
 * 2. Update order status dropdown
 * 3. Process button
 *
 * 🔄 Redux Toolkit:
 * - orderSlice: getOrderDetails, updateOrderStatus, clearOrderErrors
 */

import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
} from "@mui/material";
import { AccountTree } from "@mui/icons-material";
import {
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCreditCard,
  FaShoppingBag,
} from "react-icons/fa";

// ✅ Redux Toolkit imports
import {
  getOrderDetails,
  updateOrderStatus,
  clearOrderErrors,
  selectOrderDetails,
  selectOrderDetailsLoading,
  selectOrderDetailsError,
} from "../../features/orders/orderSlice";

import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";

const ProcessOrder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 📊 Redux state
  const order = useSelector(selectOrderDetails);
  const loading = useSelector(selectOrderDetailsLoading);
  const error = useSelector(selectOrderDetailsError);
  const { isUpdated, loading: updateLoading } = useSelector(
    (state) => state.orders,
  );

  const [status, setStatus] = useState("");

  /**
   * 📝 Handle status update
   */
  const handleStatusUpdate = (e) => {
    e.preventDefault();
    if (!status) {
      toast.error("Please select a status");
      return;
    }
    dispatch(updateOrderStatus({ id, orderData: { status } }));
  };

  /**
   * 🎨 Get status chip
   */
  const getStatusChip = (status) => {
    const statusMap = {
      Delivered: "success",
      Processing: "warning",
      Shipped: "info",
      Cancelled: "error",
    };
    return statusMap[status] || "default";
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

    if (isUpdated) {
      toast.success("Order status updated successfully! 🎉");
      navigate("/admin/orders");
    }

    if (id) {
      dispatch(getOrderDetails(id));
    }
  }, [dispatch, id, error, isUpdated, navigate]);

  // Set status when order loads
  useEffect(() => {
    if (order && order._id) {
      setStatus(order.orderStatus || "");
    }
  }, [order]);

  if (loading) return <Loader />;

  if (!order || !order._id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">Order Not Found</h2>
          <Link
            to="/admin/orders"
            className="text-red-500 hover:text-red-600 mt-4 inline-block"
          >
            ← Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  // 📊 Get available status options
  const getStatusOptions = () => {
    const currentStatus = order.orderStatus;
    const options = [];

    if (currentStatus === "Processing") options.push("Shipped");
    if (currentStatus === "Shipped") options.push("Delivered");
    if (currentStatus === "Processing" || currentStatus === "Shipped") {
      options.push("Cancelled");
    }

    return options;
  };

  const isDelivered = order.orderStatus === "Delivered";

  return (
    <Fragment>
      <MetaData title="Process Order | Admin Panel" />

      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <Sidebar />

          <div className="flex-1 ml-64 p-6">
            {/* 🏷️ Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between mb-6"
            >
              <div>
                <h1 className="text-3xl font-bold">Process Order</h1>
                <p className="text-gray-500">
                  Order #{order._id?.slice(-8).toUpperCase()}
                </p>
              </div>
              <Chip
                label={order.orderStatus}
                color={getStatusChip(order.orderStatus)}
                size="medium"
                sx={{ fontWeight: "bold", px: 2 }}
              />
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 📝 Order Details - Left */}
              <div className="lg:col-span-2 space-y-6">
                {/* Shipping Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-xl p-6"
                >
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <FaUser className="text-red-500" />
                    Shipping Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <FaUser className="text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium">
                          {order.user?.name || "N/A"}
                        </p>
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

                {/* Payment Info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
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
                      />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Amount</p>
                      <p className="text-lg font-semibold text-red-500">
                        ₹{order.totalPrice?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Order Items */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-2xl shadow-xl p-6"
                >
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                    <FaShoppingBag className="text-red-500" />
                    Order Items ({order.orderItems?.length || 0})
                  </h3>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {order.orderItems?.map((item) => (
                      <div
                        key={item.product}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded-lg"
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

              {/* ⚙️ Status Update - Right */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="lg:col-span-1"
              >
                {!isDelivered ? (
                  <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
                    <h3 className="text-xl font-bold mb-6 border-b pb-4">
                      Update Status
                    </h3>

                    <form onSubmit={handleStatusUpdate} className="space-y-4">
                      <FormControl fullWidth>
                        <InputLabel>Order Status</InputLabel>
                        <Select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          required
                          startAdornment={
                            <AccountTree className="text-gray-400 mr-2" />
                          }
                        >
                          <MenuItem value="">Select Status</MenuItem>
                          {getStatusOptions().map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <Button
                        type="submit"
                        disabled={updateLoading || !status}
                        variant="contained"
                        fullWidth
                        sx={{
                          py: 1.5,
                          borderRadius: "12px",
                          background:
                            "linear-gradient(135deg, #ef4444, #dc2626)",
                          "&:hover": {
                            background:
                              "linear-gradient(135deg, #dc2626, #b91c1c)",
                          },
                        }}
                      >
                        {updateLoading ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          "Update Status"
                        )}
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className="bg-green-50 rounded-2xl shadow-xl p-6 border-2 border-green-200">
                    <div className="text-center">
                      <div className="text-4xl mb-4">✅</div>
                      <h3 className="text-xl font-bold text-green-700">
                        Order Delivered
                      </h3>
                      <p className="text-green-600 text-sm mt-2">
                        This order has been delivered successfully.
                      </p>
                      <Link
                        to="/admin/orders"
                        className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Back to Orders
                      </Link>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default ProcessOrder;
