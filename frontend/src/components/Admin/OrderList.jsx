// src/components/Admin/OrderList.jsx

/**
 * 📋 ORDER LIST - Admin order management
 *
 * Features:
 * 1. Data grid with all orders
 * 2. Edit/Process order link
 * 3. Delete order action
 * 4. Status indicators
 *
 * 📦 Packages Used:
 * - @mui/x-data-grid: v6+ (modern data grid)
 * - react-hot-toast: v2+ (toast notifications)
 * - framer-motion: v9+ (animations)
 *
 * 🔄 Redux Toolkit:
 * - orderSlice: getAllOrders, deleteOrder, clearOrderErrors
 */

import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { DataGrid } from "@mui/x-data-grid";
import { Chip, IconButton } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { FaCheckCircle, FaTimesCircle, FaClock, FaTruck } from "react-icons/fa";

// ✅ Redux Toolkit imports
import {
  getAllOrders,
  deleteOrder,
  clearOrderErrors,
  selectAllOrders,
  selectAllOrdersLoading,
  selectAllOrdersError,
} from "../../features/orders/orderSlice";

import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";

const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 📊 Redux state
  const orders = useSelector(selectAllOrders);
  const loading = useSelector(selectAllOrdersLoading);
  const error = useSelector(selectAllOrdersError);
  const { isDeleted } = useSelector((state) => state.orders);

  /**
   * 🗑️ Delete order handler
   */
  const deleteOrderHandler = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(id));
    }
  };

  /**
   * 🎨 Get status chip
   */
  const getStatusChip = (status) => {
    const statusMap = {
      Delivered: {
        color: "success",
        icon: <FaCheckCircle className="text-green-500" />,
      },
      Processing: {
        color: "warning",
        icon: <FaClock className="text-yellow-500" />,
      },
      Shipped: { color: "info", icon: <FaTruck className="text-blue-500" /> },
      Cancelled: {
        color: "error",
        icon: <FaTimesCircle className="text-red-500" />,
      },
    };
    return (
      statusMap[status] || {
        color: "default",
        icon: <FaClock className="text-gray-500" />,
      }
    );
  };

  /**
   * 📋 Data Grid Columns
   */
  const columns = [
    {
      field: "id",
      headerName: "Order ID",
      minWidth: 250,
      flex: 0.6,
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
      flex: 0.4,
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
      headerName: "Amount",
      type: "number",
      minWidth: 180,
      flex: 0.4,
      renderCell: (params) => (
        <span className="font-semibold text-red-500">
          ₹{params.value?.toFixed(2)}
        </span>
      ),
    },
    {
      field: "user",
      headerName: "Customer",
      minWidth: 180,
      flex: 0.4,
    },
    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      sortable: false,
      renderCell: (params) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/admin/order/${params.getValue(params.id, "id")}`}
            className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
          >
            <Edit fontSize="small" />
          </Link>
          <button
            onClick={() => deleteOrderHandler(params.getValue(params.id, "id"))}
            className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
          >
            <Delete fontSize="small" />
          </button>
        </div>
      ),
    },
  ];

  /**
   * 📊 Format rows for Data Grid
   */
  const rows =
    orders?.map((item) => ({
      id: item._id,
      itemsQty: item.orderItems?.length || 0,
      amount: item.totalPrice || 0,
      status: item.orderStatus || "Processing",
      user: item.user?.name || "Unknown",
    })) || [];

  // 🔄 Effects
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearOrderErrors());
    }

    if (isDeleted) {
      toast.success("Order deleted successfully! 🎉");
      dispatch(getAllOrders());
    }

    dispatch(getAllOrders());
  }, [dispatch, error, isDeleted]);

  if (loading) return <Loader />;

  return (
    <Fragment>
      <MetaData title="All Orders | Admin Panel" />

      <div className="min-h-screen bg-gray-50">
        <div className="flex">
          <Sidebar />

          <div className="flex-1 ml-64 p-6">
            {/* 🏷️ Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <h1 className="text-3xl font-bold">All Orders</h1>
              <p className="text-gray-500">Manage customer orders</p>
            </motion.div>

            {/* 📊 Orders Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-xl p-4"
            >
              <div style={{ height: 500, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={10}
                  rowsPerPageOptions={[10, 25, 50]}
                  disableSelectionOnClick
                  getRowId={(row) => row.id}
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
              </div>

              {/* 📊 Stats */}
              <div className="flex items-center gap-6 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Total: <strong>{rows.length}</strong> orders
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-green-500" />
                  <span className="text-sm text-gray-600">
                    Delivered:{" "}
                    <strong>
                      {rows.filter((r) => r.status === "Delivered").length}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="text-yellow-500" />
                  <span className="text-sm text-gray-600">
                    Processing:{" "}
                    <strong>
                      {rows.filter((r) => r.status === "Processing").length}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTimesCircle className="text-red-500" />
                  <span className="text-sm text-gray-600">
                    Cancelled:{" "}
                    <strong>
                      {rows.filter((r) => r.status === "Cancelled").length}
                    </strong>
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default OrderList;
