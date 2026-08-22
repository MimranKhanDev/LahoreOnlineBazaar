// backend/routes/products.js

/**
 * 📦 PRODUCT ROUTES - Product Management
 *
 * This file defines ALL product-related API endpoints
 *
 * 🔄 API ENDPOINTS:
 *    GET    /api/v1/products                - Get all products
 *    GET    /api/v1/product/:id             - Get single product
 *    POST   /api/v1/admin/product/new       - Create product (Admin)
 *    GET    /api/v1/admin/products          - Get all products (Admin)
 *    PUT    /api/v1/admin/product/:id       - Update product (Admin)
 *    DELETE /api/v1/admin/product/:id       - Delete product (Admin)
 *    PUT    /api/v1/review                  - Create/Update review
 *    GET    /api/v1/reviews                 - Get product reviews
 *    DELETE /api/v1/admin/reviews           - Delete review (Admin)
 *    GET    /api/v1/can_review              - Check if user can review
 *
 * ✅ FIXES MADE:
 *    1. Changed /reviews (PUT) → /review (PUT) (matches tutorial)
 *    2. Added /admin/reviews (DELETE) (matches tutorial)
 *    3. Changed /products/:id → /product/:id (matches tutorial)
 *    4. Changed /admin/products (POST) → /admin/product/new (matches tutorial)
 *    5. Fixed admin product update path
 *    6. Fixed admin product delete path
 *    7. Reordered routes for proper matching
 */

import express from "express";
const router = express.Router();

// ✅ Import middleware
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";

// ✅ Import controllers (using tutorial function names)
import {
  getAllProducts, // ✅ Changed from getProducts
  createProduct, // ✅ Changed from newProduct
  updateProduct,
  deleteProduct,
  getProductDetails,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
  uploadProductImages,
  deleteProductImage,
  canUserReview,
} from "../controllers/productControllers.js";

// ============= 🔓 PUBLIC ROUTES =============

// 📋 Get all products (with filters & pagination)
router.route("/products").get(getAllProducts);

// 🔍 Get single product
router.route("/product/:id").get(getProductDetails); // ✅ Fixed path

// ============= 🔒 ADMIN ROUTES =============

// ➕ Create new product (Admin only)
router
  .route("/admin/product/new") // ✅ Fixed path
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);

// 📋 Get all products (Admin only)
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);

// 📷 Upload product images (Admin only)
router
  .route("/admin/product/:id/upload_images") // ✅ Fixed path
  .put(isAuthenticatedUser, authorizeRoles("admin"), uploadProductImages);

// 🗑️ Delete product image (Admin only)
router
  .route("/admin/product/:id/delete_image") // ✅ Fixed path
  .put(isAuthenticatedUser, authorizeRoles("admin"), deleteProductImage);

// ✏️ Update product (Admin only)
// 🗑️ Delete product (Admin only)
router
  .route("/admin/product/:id") // ✅ Fixed path
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// ============= ⭐ REVIEW ROUTES =============

// ⭐ Create/Update review (Authenticated user)
router.route("/review").put(isAuthenticatedUser, createProductReview); // ✅ Fixed path

// 📋 Get product reviews (Public)
router.route("/reviews").get(getProductReviews);

// 🗑️ Delete review (Admin only)
router
  .route("/admin/reviews") // ✅ Added (matches tutorial)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);

// ✅ Check if user can review
router.route("/can_review").get(isAuthenticatedUser, canUserReview);

export default router;
