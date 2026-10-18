import express from "express";
const router = express.Router();
import { authorizeRoles, isAuthenticatedUser } from "../middlewares/auth.js";
import {
  getAllProducts,
  createProduct,
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
router.route("/products").get(getAllProducts);
router.route("/product/:id").get(getProductDetails);

// ============= 🔒 ADMIN ROUTES =============
router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin"), createProduct);
router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminProducts);
router
  .route("/admin/product/:id/upload_images")
  .put(isAuthenticatedUser, authorizeRoles("admin"), uploadProductImages);
router
  .route("/admin/product/:id/delete_image")
  .put(isAuthenticatedUser, authorizeRoles("admin"), deleteProductImage);
router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteProduct);

// ============= ⭐ REVIEW ROUTES =============
router.route("/review").put(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(getProductReviews);
router
  .route("/admin/reviews")
  .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteReview);
router.route("/can_review").get(isAuthenticatedUser, canUserReview);

export default router;
