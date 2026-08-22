// src/components/Admin/Dashboard.jsx

/**
 * 📊 DASHBOARD - Admin dashboard with analytics
 *
 * Features:
 * 1. Summary cards (Total Amount, Products, Orders, Users)
 * 2. Revenue chart (Line chart)
 * 3. Stock status chart (Doughnut chart)
 *
 * 📦 Packages Used:
 * - recharts: v2+ (modern charts)
 * - framer-motion: v9+ (animations)
 *
 * 🔄 Redux Toolkit:
 * - productSlice: getAdminProducts
 * - orderSlice: getAllOrders
 * - userSlice: getAllUsers
 */

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import {
  FaShoppingBag,
  FaBox,
  FaUsers,
  FaDollarSign,
  FaBoxOpen,
  FaCheckCircle,
} from "react-icons/fa";

// ✅ Redux Toolkit imports
import {
  getAdminProducts,
  selectAdminProducts,
  selectAdminLoading,
} from "../../features/products/productSlice";
import {
  getAllOrders,
  selectAllOrders,
} from "../../features/orders/orderSlice";
import { getAllUsers, selectAllUsers } from "../../features/user/userSlice";

import Sidebar from "./Sidebar";
import MetaData from "../layout/MetaData";
import Loader from "../layout/Loader/Loader";

const Dashboard = () => {
  const dispatch = useDispatch();

  // 📊 Redux state
  const products = useSelector(selectAdminProducts) || [];
  const orders = useSelector(selectAllOrders) || [];
  const users = useSelector(selectAllUsers) || [];
  const loading = useSelector(selectAdminLoading);

  // 📊 Calculate stats
  const outOfStock = products.filter((item) => item.Stock === 0).length;
  const totalAmount = orders.reduce((acc, item) => acc + item.totalPrice, 0);

  /**
   * 📈 Revenue chart data
   */
  const revenueData = [
    { name: "Jan", revenue: Math.round(totalAmount * 0.1) },
    { name: "Feb", revenue: Math.round(totalAmount * 0.15) },
    { name: "Mar", revenue: Math.round(totalAmount * 0.2) },
    { name: "Apr", revenue: Math.round(totalAmount * 0.12) },
    { name: "May", revenue: Math.round(totalAmount * 0.18) },
    { name: "Jun", revenue: Math.round(totalAmount * 0.25) },
  ];

  /**
   * 🍩 Stock pie chart data
   */
  const stockData = [
    { name: "In Stock", value: products.length - outOfStock },
    { name: "Out of Stock", value: outOfStock },
  ];

  const COLORS = ["#22c55e", "#ef4444"];

  /**
   * 📊 Summary cards data
   */
  const summaryCards = [
    {
      title: "Total Revenue",
      value: `₹${totalAmount.toLocaleString()}`,
      icon: FaDollarSign,
      color: "from-green-500 to-green-600",
    },
    {
      title: "Products",
      value: products.length,
      icon: FaBox,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Orders",
      value: orders.length,
      icon: FaShoppingBag,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Users",
      value: users.length,
      icon: FaUsers,
      color: "from-orange-500 to-orange-600",
    },
  ];

  useEffect(() => {
    dispatch(getAdminProducts());
    dispatch(getAllOrders());
    dispatch(getAllUsers());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50">
      <MetaData title="Dashboard | Admin Panel" />

      <div className="flex">
        {/* 📋 Sidebar */}
        <Sidebar />

        {/* 📊 Main Content */}
        <div className="flex-1 ml-64 p-6">
          {/* 🏷️ Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-gray-500">Welcome back, Admin!</p>
          </motion.div>

          {/* 📊 Summary Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {summaryCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-r ${card.color} rounded-2xl shadow-lg p-6 text-white`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">{card.title}</p>
                    <p className="text-2xl font-bold mt-1">{card.value}</p>
                  </div>
                  <card.icon className="text-3xl opacity-60" />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* 📈 Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart - 2/3 width */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-lg font-bold mb-4">Revenue Overview</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => [`₹${value}`, "Revenue"]}
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#ef4444"
                      strokeWidth={3}
                      dot={{ fill: "#ef4444", strokeWidth: 2 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Stock Chart - 1/3 width */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-xl p-6"
            >
              <h3 className="text-lg font-bold mb-4">Stock Status</h3>
              <div className="h-72 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stockData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stockData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [value, "Products"]}
                      contentStyle={{
                        backgroundColor: "white",
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">In Stock</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Out of Stock</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 📊 Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6"
          >
            <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <FaCheckCircle className="text-2xl text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">In Stock Products</p>
                <p className="text-xl font-bold">
                  {products.length - outOfStock}
                </p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <FaBoxOpen className="text-2xl text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Out of Stock</p>
                <p className="text-xl font-bold">{outOfStock}</p>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <FaShoppingBag className="text-2xl text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-xl font-bold">{orders.length}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
