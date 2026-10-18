import express from "express";
const router = express.Router();
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
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

router.route("/order/new").post(isAuthenticatedUser, newOrder); // ✅ Fixed path
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder); // ✅ Fixed path
router.route("/orders/me").get(isAuthenticatedUser, myOrders); // ✅ Fixed path

// ============= 🔒 ADMIN ROUTES =============
router
  .route("/admin/get_sales")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getSales);
router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAllOrders);
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteOrder);

export default router;
