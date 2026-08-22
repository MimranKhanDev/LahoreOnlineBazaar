// backend/routes/order.js

/**
 * 📋 ORDER ROUTES - Order Management
 *
 * This file defines ALL order-related API endpoints
 *
 * 🔄 API ENDPOINTS:
 *    POST   /api/v1/order/new         - Create new order
 *    GET    /api/v1/order/:id         - Get single order
 *    GET    /api/v1/orders/me         - Get my orders
 *    GET    /api/v1/admin/orders      - Get all orders (Admin)
 *    PUT    /api/v1/admin/order/:id   - Update order (Admin)
 *    DELETE /api/v1/admin/order/:id   - Delete order (Admin)
 *    GET    /api/v1/admin/get_sales   - Get sales data (Admin)
 *
 * ✅ FIXES MADE:
 *    1. Changed /orders/new → /order/new (matches tutorial)
 *    2. Changed /me/orders → /orders/me (matches tutorial)
 *    3. Changed /admin/orders/:id → /admin/order/:id (matches tutorial)
 *    4. Fixed controller function names
 */

import express from "express";
const router = express.Router();

// ✅ Import middleware
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";

// ✅ Import controllers (using tutorial function names)
import {
  newOrder,
  getSingleOrder,
  myOrders,
  getAllOrders,
  updateOrder,
  deleteOrder,
  getSales,
} from "../controllers/orderControllers.js";

// ============= 🔒 PROTECTED ROUTES =============

// 📝 Create new order
router.route("/order/new").post(isAuthenticatedUser, newOrder); // ✅ Fixed path

// 🔍 Get single order
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder); // ✅ Fixed path

// 📋 Get my orders
router.route("/orders/me").get(isAuthenticatedUser, myOrders); // ✅ Fixed path

// ============= 🔒 ADMIN ROUTES =============

// 📊 Get sales data (Admin only)
router
  .route("/admin/get_sales")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSales);

// 📋 Get all orders (Admin only)
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);

// ✏️ Update order (Admin only)
// 🗑️ Delete order (Admin only)
router
  .route("/admin/order/:id") // ✅ Fixed path
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

export default router;
