// backend/controllers/orderControllers.js

/**
 * 📋 ORDER CONTROLLERS - Order management
 *
 * This file handles ALL order-related operations:
 * 1. Create new order
 * 2. Get user's orders
 * 3. Get single order (with ownership check)
 * 4. Get all orders (Admin)
 * 5. Update order status (Admin)
 * 6. Delete order (Admin)
 * 7. Get sales data (Admin)
 *
 * 🔄 API ENDPOINTS:
 *    POST   /api/v1/order/new         - Create order
 *    GET    /api/v1/orders/me         - Get my orders
 *    GET    /api/v1/order/:id         - Get single order
 *    GET    /api/v1/admin/orders      - Get all orders (Admin)
 *    PUT    /api/v1/admin/order/:id   - Update order (Admin)
 *    DELETE /api/v1/admin/order/:id   - Delete order (Admin)
 *    GET    /api/v1/admin/get_sales   - Get sales data (Admin)
 */

import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import ErrorHandler from "../utils/errorHandler.js";

/**
 * 📝 Create New Order
 *
 * 📥 Body: { shippingInfo, orderItems, itemsPrice, taxPrice, shippingPrice, totalPrice, paymentInfo }
 * 📤 Returns: { success: true, order }
 *
 * ✅ FIX: Added success field
 * ✅ FIX: Uses taxPrice, shippingPrice to match tutorial
 */
export const newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice, // ✅ Changed from taxAmount to match tutorial
    shippingPrice, // ✅ Changed from shippingAmount to match tutorial
    totalPrice,
  } = req.body;
  const order = await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice, // ✅ Changed from taxAmount
    shippingPrice, // ✅ Changed from shippingAmount
    totalPrice,
    paidAt: Date.now(),
    user: req.user._id,
  });
  res.status(201).json({
    success: true, // ✅ Added
    order,
  });
});

/**
 * 📋 Get My Orders (Current User)
 * 📤 Returns: { success: true, orders }
 * ✅ FIX: Added success field
 */
export const myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id });
  res.status(200).json({
    success: true, // ✅ Added
    orders,
  });
});

/**
 * 🔍 Get Single Order
 * 📥 Params: id
 * 📤 Returns: { success: true, order }
 * ✅ FIX: Added ownership check (user can only see their own order)
 * ✅ FIX: Added success field
 */
export const getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email",
  );
  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }
  // ✅ Check if user owns this order (unless admin)
  if (
    order.user._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorHandler("You are not authorized to view this order", 403),
    );
  }
  res.status(200).json({
    success: true, // ✅ Added
    order,
  });
});

/**
 * 📋 Get All Orders - ADMIN ONLY
 *
 * 📤 Returns: { success: true, orders, totalAmount }
 *
 * ✅ FIX: Added success field and totalAmount (matches tutorial)
 */
export const getAllOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();
  let totalAmount = 0;
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });
  res.status(200).json({
    success: true, // ✅ Added
    totalAmount, // ✅ Added (matches tutorial)
    orders,
  });
});

/**
 * ✏️ Update Order Status - ADMIN ONLY
 * 📥 Params: id
 * 📥 Body: { status }
 * 📤 Returns: { success: true }
 * ✅ FIX: Added success field
 */
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }
  // ✅ Update stock when order is shipped
  if (req.body.status === "Shipped") {
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.Stock -= item.quantity;
        await product.save({ validateBeforeSave: false });
      }
    }
  }
  order.orderStatus = req.body.status;
  if (req.body.status === "Delivered") {
    order.deliveredAt = Date.now();
  }
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true, // ✅ Added
  });
});

/**
 * 🗑️ Delete Order - ADMIN ONLY
 *
 * 📥 Params: id
 * 📤 Returns: { success: true }
 *
 * ✅ FIX: Added success field
 */
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }
  await order.deleteOne();
  res.status(200).json({
    success: true, // ✅ Added
  });
});

/**
 * 📊 Get Sales Data - ADMIN ONLY
 *
 * 📥 Query: startDate, endDate
 * 📤 Returns: { totalSales, totalNumOrders, sales }
 */
export const getSales = catchAsyncErrors(async (req, res, next) => {
  const startDate = new Date(req.query.startDate);
  const endDate = new Date(req.query.endDate);
  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(23, 59, 59, 999);
  const { salesData, totalSales, totalNumOrders } = await getSalesData(
    startDate,
    endDate,
  );
  res.status(200).json({
    success: true,
    totalSales,
    totalNumOrders,
    sales: salesData,
  });
});

/**
 * 📊 Helper: Get Sales Data
 */
async function getSalesData(startDate, endDate) {
  const salesData = await Order.aggregate([
    {
      $match: {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        },
        totalSales: { $sum: "$totalPrice" },
        numOrders: { $sum: 1 },
      },
    },
  ]);
  const salesMap = new Map();
  let totalSales = 0;
  let totalNumOrders = 0;
  salesData.forEach((entry) => {
    const date = entry?._id.date;
    const sales = entry?.totalSales;
    const numOrders = entry?.numOrders;
    salesMap.set(date, { sales, numOrders });
    totalSales += sales;
    totalNumOrders += numOrders;
  });
  const datesBetween = getDatesBetween(startDate, endDate);
  const finalSalesData = datesBetween.map((date) => ({
    date,
    sales: (salesMap.get(date) || { sales: 0 }).sales,
    numOrders: (salesMap.get(date) || { numOrders: 0 }).numOrders,
  }));
  return { salesData: finalSalesData, totalSales, totalNumOrders };
}

/**
 * 📅 Helper: Get Dates Between
 */
function getDatesBetween(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= new Date(endDate)) {
    const formattedDate = currentDate.toISOString().split("T")[0];
    dates.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}
