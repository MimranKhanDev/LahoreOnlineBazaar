import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";
import { delete_file, upload_file } from "../utils/cloudinary.js";

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

export const createProduct = catchAsyncErrors(async (req, res, next) => {
  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else if (Array.isArray(req.body.images)) {
    images = req.body.images;
  }
  const uploadPromises = images.map((image) => upload_file(image, "products"));
  const uploadedImages = await Promise.all(uploadPromises);
  const imagesLinks = uploadedImages.map((result) => ({
    public_id: result.public_id,
    url: result.url,
  }));

  req.body.images = imagesLinks;
  req.body.user = req.user._id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true, // ✅ Added
    product,
  });
});

export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) {
    console.log(`Product not found with ID: ${id}`);
    return next(new ErrorHandler("Product not found", 404));
  }
  if (product.reviews && product.reviews.length > 0) {
    try {
      await product.populate({
        path: "reviews.user",
        select: "name email avatar",
      });
    } catch (populateError) {
      console.warn("Could not populate review users:", populateError.message);
    }
  }
  res.status(200).json({
    success: true,
    product,
  });
});

export const getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();
  res.status(200).json({
    success: true,
    products,
  });
});

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req?.params?.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  if (req.body.images) {
    let images = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
    for (let i = 0; i < product.images.length; i++) {
      if (product.images[i].public_id) {
        await delete_file(product.images[i].public_id);
      }
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
  }
  product = await Product.findByIdAndUpdate(req?.params?.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    product,
  });
});

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
    success: true,
    product,
  });
});

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
    success: true,
    product,
  });
});

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req?.params?.id);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  for (let i = 0; i < product?.images?.length; i++) {
    if (product?.images[i]?.public_id) {
      await delete_file(product?.images[i].public_id);
    }
  }
  await product.deleteOne();
  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

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
  const isReviewed = product?.reviews?.find(
    (r) => r.user.toString() === req?.user?._id.toString(),
  );
  if (isReviewed) {
    product.reviews.forEach((review) => {
      if (review?.user?.toString() === req?.user?._id.toString()) {
        review.comment = comment;
        review.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }
  product.ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    product.reviews.length;
  await product.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

export const getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id).populate("reviews.user");
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.query.productId);
  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }
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
    success: true,
    product,
  });
});

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
