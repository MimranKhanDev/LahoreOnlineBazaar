// src/components/Order/MyOrders.jsx

/**
 * 📋 MY ORDERS - User's order history
 *
 * Features:
 * 1. Data grid with order details
 * 2. Order ID, Status, Items Qty, Amount
 * 3. View order details link
 * 4. Status color coding
 *
 * 📦 Packages Used:
 * - @mui/x-data-grid: v6+ (modern data grid)
 * - react-hot-toast: v2+ (toast notifications)
 * - framer-motion: v9+ (animations)
 *
 * 🔄 Redux Toolkit:
 * - orderSlice: getMyOrders, clearOrderErrors
 */

import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import { FaEye, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa";
import { Chip, Box } from "@mui/material";

// ✅ Redux Toolkit imports
import {
  getMyOrders,
  clearOrderErrors,
  selectMyOrders,
  selectMyOrdersLoading,
  selectMyOrdersError,
} from "../../features/orders/orderSlice";
import { selectUser } from "../../features/user/userSlice";

import Loader from "../layout/Loader/Loader";
import MetaData from "../layout/MetaData";

const MyOrders = () => {
  const dispatch = useDispatch();

  // 📊 Redux state
  const orders = useSelector(selectMyOrders);
  const loading = useSelector(selectMyOrdersLoading);
  const error = useSelector(selectMyOrdersError);
  const user = useSelector(selectUser);

  /**
   * 🎨 Get status chip color
   */
  const getStatusChip = (status) => {
    const statusMap = {
      Delivered: { color: "success", icon: <FaCheckCircle /> },
      Processing: { color: "warning", icon: <FaClock /> },
      Shipped: { color: "info", icon: <FaClock /> },
      Cancelled: { color: "error", icon: <FaTimesCircle /> },
    };
    return statusMap[status] || { color: "default", icon: <FaClock /> };
  };

  /**
   * 📋 Data Grid Columns
   */
  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 280,
      flex: 1,
      renderCell: (params) => (
        <span className="font-mono text-sm">
          #{params.value.slice(-8).toUpperCase()}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex: 0.5,
      renderCell: (params) => {
        const status = params.value;
        const { color, icon } = getStatusChip(status);
        return (
          <Chip
            icon={icon}
            label={status}
            color={color}
            size="small"
            variant="outlined"
            sx={{ fontWeight: "medium" }}
          />
        );
      },
    },
    {
      field: "itemsQty",
      headerName: "Items",
      type: "number",
      minWidth: 120,
      flex: 0.3,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "amount",
      headerName: "Total Amount",
      type: "number",
      minWidth: 180,
      flex: 0.5,
      renderCell: (params) => (
        <span className="font-semibold text-red-500">
          ₹{params.value?.toFixed(2)}
        </span>
      ),
    },
    {
      field: "createdAt",
      headerName: "Date",
      minWidth: 180,
      flex: 0.5,
      renderCell: (params) => (
        <span className="text-gray-500 text-sm">
          {new Date(params.value).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 120,
      sortable: false,
      renderCell: (params) => (
        <Link
          to={`/order/${params.getValue(params.id, "id")}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
        >
          <FaEye className="text-sm" />
          <span className="text-sm font-medium">View</span>
        </Link>
      ),
    },
  ];

  /**
   * 📊 Format rows for Data Grid
   */
  const rows =
    orders?.map((order) => ({
      id: order._id,
      itemsQty: order.orderItems?.length || 0,
      status: order.orderStatus || "Processing",
      amount: order.totalPrice || 0,
      createdAt: order.createdAt || new Date(),
    })) || [];

  // 🔄 Effects
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearOrderErrors());
    }
    dispatch(getMyOrders());
  }, [dispatch, error]);

  return (
    <Fragment>
      <MetaData title={`${user?.name || "User"}'s Orders | ECOMMERCE`} />

      {loading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
          <div className="container mx-auto max-w-7xl">
            {/* 🏷️ Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h1 className="text-3xl md:text-4xl font-bold">
                My <span className="text-red-500">Orders</span>
              </h1>
              <p className="text-gray-500 mt-1">
                {user?.name}, here are all your orders
              </p>
            </motion.div>

            {/* 📊 Orders Table */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden p-4"
            >
              {rows.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📦</div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    No Orders Yet
                  </h3>
                  <p className="text-gray-500 mb-6">
                    You haven't placed any orders yet.
                  </p>
                  <Link
                    to="/products"
                    className="inline-block px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Start Shopping
                  </Link>
                </div>
              ) : (
                <Box sx={{ height: 400, width: "100%" }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    disableSelectionOnClick
                    autoHeight
                    sx={{
                      "& .MuiDataGrid-columnHeaders": {
                        backgroundColor: "#f1f5f9",
                        borderRadius: "12px",
                        "& .MuiDataGrid-columnHeader": {
                          "&:focus": { outline: "none" },
                          "& .MuiDataGrid-columnHeaderTitle": {
                            fontWeight: 700,
                            color: "#1e293b",
                          },
                        },
                      },
                      "& .MuiDataGrid-row": {
                        "&:hover": {
                          backgroundColor: "#f8fafc",
                        },
                      },
                      "& .MuiDataGrid-cell": {
                        "&:focus": { outline: "none" },
                      },
                      "& .MuiDataGrid-footerContainer": {
                        borderTop: "1px solid #e2e8f0",
                      },
                    }}
                  />
                </Box>
              )}
            </motion.div>

            {/* 📊 Order Stats Summary */}
            {rows.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6"
              >
                <div className="bg-white rounded-xl shadow-md p-4 text-center">
                  <p className="text-2xl font-bold text-red-500">
                    {rows.length}
                  </p>
                  <p className="text-sm text-gray-500">Total Orders</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 text-center">
                  <p className="text-2xl font-bold text-green-500">
                    {rows.filter((r) => r.status === "Delivered").length}
                  </p>
                  <p className="text-sm text-gray-500">Delivered</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-500">
                    {rows.filter((r) => r.status === "Processing").length}
                  </p>
                  <p className="text-sm text-gray-500">Processing</p>
                </div>
                <div className="bg-white rounded-xl shadow-md p-4 text-center">
                  <p className="text-2xl font-bold text-red-500">
                    {rows.filter((r) => r.status === "Cancelled").length}
                  </p>
                  <p className="text-sm text-gray-500">Cancelled</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default MyOrders;
