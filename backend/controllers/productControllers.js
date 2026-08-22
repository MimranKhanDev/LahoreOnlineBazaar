// backend/controllers/productControllers.js

/**
 * 📦 PRODUCT CONTROLLERS - Product management
 *
 * This file handles ALL product-related operations:
 * 1. Get products (with filters, pagination)
 * 2. Create/Update/Delete products (Admin)
 * 3. Product reviews
 * 4. Product images management
 *
 * 📦 PACKAGES USED:
 *    - cloudinary: For image uploads
 *    - APIFilters: For filtering, searching, pagination
 *
 * 🔄 API ENDPOINTS:
 *    GET    /api/v1/products                - Get all products
 *    GET    /api/v1/products/:id            - Get single product
 *    POST   /api/v1/admin/products/new      - Create product (Admin)
 *    PUT    /api/v1/admin/products/:id      - Update product (Admin)
 *    DELETE /api/v1/admin/products/:id      - Delete product (Admin)
 *    POST   /api/v1/admin/products/:id/upload_images - Upload images (Admin)
 *    DELETE /api/v1/admin/products/:id/delete_image - Delete image (Admin)
 *    PUT    /api/v1/reviews                 - Create/Update review
 *    GET    /api/v1/reviews                 - Get product reviews
 *    DELETE /api/v1/admin/reviews           - Delete review (Admin)
 *    GET    /api/v1/can_review              - Check if user can review
 */

import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";
import { delete_file, upload_file } from "../utils/cloudinary.js";

/**
 * 📋 Get All Products (with filters & pagination)
 *
 * 📥 Query: keyword, page, price[gte], price[lte], category, ratings
 * 📤 Returns: { products, productsCount, resultPerPage, filteredProductsCount }
 *
 * ✅ FIX: Added success field and productsCount to match tutorial format
 * ✅ FIX: Changed resPerPage to resultPerPage to match tutorial
 */
export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 10;
  const apiFilters = new APIFilters(Product.find(), req.query)
    .search()
    .filters();
  let products = await apiFilters.query;
  let filteredProductsCount = products.length;
  apiFilters.pagination(resultPerPage);
  products = await apiFilters.query.clone();
  const productsCount = await Product.countDocuments();
  res.status(200).json({
    success: true,
    products,
    productsCount,
    resultPerPage,
    filteredProductsCount,
  });
});

/**
 * ➕ Create New Product - ADMIN ONLY
 *
 * 📥 Body: { name, price, description, category, Stock, images }
 * 📤 Returns: { success: true, product }
 *
 * ✅ FIX: Added success field
 */

export const createProduct = catchAsyncErrors(async (req, res, next) => {
  // OLD CODE — BUGGY: images could be undefined and Cloudinary returns url, not secure_url.
  // let images = [];
  // if (typeof req.body.images === "string") images.push(req.body.images);
  // else images = req.body.images;

  // NEW CODE — FIX: allow product creation without images while preserving Cloudinary uploads.
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else if (Array.isArray(req.body.images)) {
    images = req.body.images;
  }
  const imagesLinks = [];
  for (let i = 0; i < images.length; i++) {
    const result = await upload_file(images[i], "products");
    imagesLinks.push({
      public_id: result.public_id,
      url: result.url,
    });
  }
  req.body.images = imagesLinks;
  req.body.user = req.user._id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true, // ✅ Added
    product,
  });
});

/**
 * 🔍 Get Single Product
 *
 * 📥 Params: id
 * 📤 Returns: { success: true, product }
 *
 * ✅ FIX: Added success field
 */
// ✅ COMPLETE FIXED VERSION

export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  // ✅ Step 1: Find product without populate first
  const product = await Product.findById(id);
  // 🚫 Step 2: Check if product exists
  if (!product) {
    console.log(`Product not found with ID: ${id}`);
    return next(new ErrorHandler("Product not found", 404));
  }
  // ✅ Step 3: Populate reviews safely
  if (product.reviews && product.reviews.length > 0) {
    try {
      await product.populate({
        path: "reviews.user",
        select: "name email avatar",
      });
    } catch (populateError) {
      console.warn("Could not populate review users:", populateError.message);
      // Continue without user data in reviews
    }
  }
  // ✅ Step 4: Return product
  res.status(200).json({
    success: true,
    product,
  });
}); /**
 * 📋 Get All Products - ADMIN ONLY
 *
 * 📤 Returns: { success: true, products }
 *
 * ✅ FIX: Added success field
 */
export const getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true, // ✅ Added
    products,
  });
});

/**
 * ✏️ Update Product - ADMIN ONLY
 *
 * 📥 Params: id
 * 📥 Body: { name, price, description, category, Stock, images? }
 * 📤 Returns: { success: true, product }
 *
 * ✅ FIX: Added success field and image handling
 */
export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req?.params?.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  // ✅ Handle image updates
  if (req.body.images) {
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
    // Delete old images from cloudinary
    for (let i = 0; i < product.images.length; i++) {
      if (product.images[i].public_id) {
        await delete_file(product.images[i].public_id);
      }
    }
    const imagesLinks = [];
    for (let i = 0; i < images.length; i++) {
      const result = await upload_file(images[i], "products");
      // OLD CODE — BUGGY: result.secure_url is undefined because upload_file returns result.url.
      // imagesLinks.push({ public_id: result.public_id, url: result.secure_url });

      // NEW CODE — FIX: use the URL returned by the Cloudinary utility.
      imagesLinks.push({
        public_id: result.public_id,
        url: result.url,
      });
    }
    req.body.images = imagesLinks;
  }
  product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true, // ✅ Added
    product,
  });
});

/**
 * 📷 Upload Product Images - ADMIN ONLY
 *
 * 📥 Params: id
 * 📥 Body: { images: [] }
 * 📤 Returns: { success: true, product }
 *
 * ✅ FIX: Added success field
 */
export const uploadProductImages = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req?.params?.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  const uploader = async (image) => upload_file(image, "products");
  const urls = await Promise.all((req?.body?.images).map(uploader));
  product?.images?.push(...urls);
  await product?.save();
  res.status(200).json({
    success: true, // ✅ Added
    product,
  });
});

/**
 * 🗑️ Delete Product Image - ADMIN ONLY
 *
 * 📥 Params: id
 * 📥 Body: { imgId }
 * 📤 Returns: { success: true, product }
 *
 * ✅ FIX: Added success field
 */
export const deleteProductImage = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req?.params?.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  const isDeleted = await delete_file(req.body.imgId);
  if (isDeleted) {
    product.images = product?.images?.filter(
      (img) => img.public_id !== req.body.imgId,
    );
    await product?.save();
  }
  res.status(200).json({
    success: true, // ✅ Added
    product,
  });
});

/**
 * 🗑️ Delete Product - ADMIN ONLY
 *
 * 📥 Params: id
 * 📤 Returns: { success: true, message }
 *
 * ✅ FIX: Added success field
 */
export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req?.params?.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  // ✅ Delete images from cloudinary
  for (let i = 0; i < product?.images?.length; i++) {
    if (product?.images[i]?.public_id) {
      await delete_file(product?.images[i].public_id);
    }
  }
  await product.deleteOne();
  res.status(200).json({
    success: true, // ✅ Added
    message: "Product Deleted Successfully",
  });
});

/**
 * ⭐ Create/Update Product Review
 *
 * 📥 Body: { rating, comment, productId }
 * 📤 Returns: { success: true }
 */
export const createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;
  const review = {
    user: req?.user?._id,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  // ✅ Check if user already reviewed
  const isReviewed = product?.reviews?.find(
    (r) => r.user.toString() === req?.user?._id.toString(),
  );
  if (isReviewed) {
    // ✅ Update existing review
    product.reviews.forEach((review) => {
      if (review?.user?.toString() === req?.user?._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    // ✅ Add new review
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  // ✅ Calculate average rating
  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

/**
 * 📋 Get Product Reviews
 *
 * 📥 Query: id (productId)
 * 📤 Returns: { success: true, reviews }
 *
 * ✅ FIX: Added success field
 */
export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id).populate("reviews.user");
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true, // ✅ Added
    reviews: product.reviews,
  });
});

/**
 * 🗑️ Delete Review - ADMIN ONLY
 *
 * 📥 Query: productId, id (reviewId)
 * 📤 Returns: { success: true, product }
 *
 * ✅ FIX: Added success field
 */
export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  // ✅ Filter out the review
  const reviews = product?.reviews?.filter(
    (review) => review._id.toString() !== req?.query?.id.toString(),
  );
  const numOfReviews = reviews.length;
  const ratings =
    numOfReviews === 0
      ? 0
      : reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;
  product = await Product.findByIdAndUpdate(
    req.query.productId,
    { reviews, numOfReviews, ratings },
    { new: true },
  );
  res.status(200).json({
    success: true, // ✅ Added
    product,
  });
});

/**
 * ✅ Check if User Can Review
 *
 * 📥 Query: productId
 * 📤 Returns: { canReview: boolean }
 */
export const canUserReview = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user._id,
    "orderItems.product": req.query.productId,
  });
  if (orders.length === 0) {
    return res.status(200).json({ canReview: false });
  }
  res.status(200).json({
    canReview: true,
  });
});
