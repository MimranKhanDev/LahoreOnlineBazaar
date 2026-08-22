// backend/models/order.js

/**
 * 📋 ORDER MODEL - Database schema for orders
 *
 * This model defines how orders are stored in MongoDB
 *
 * 📦 FIELDS:
 *    - shippingInfo: Delivery address
 *    - orderItems: Products in the order
 *    - user: Who placed the order
 *    - paymentInfo: Payment details
 *    - paidAt: When payment was completed
 *    - itemsPrice: Subtotal of items
 *    - taxPrice: Tax amount (18% GST)
 *    - shippingPrice: Shipping charges
 *    - totalPrice: Final total
 *    - orderStatus: Processing, Shipped, Delivered
 *    - deliveredAt: When delivered
 *
 * 🔄 RELATIONSHIPS:
 *    - user: References User model
 *    - product: References Product model
 *
 * ✅ FIXES MADE:
 *    1.
 *    2.
 *    3.
 *    4.
 *    5. Added state field to shippingInfo
 *    6. Added paidAt field
 *    7. Uncommented user reference (required)
 *    8. Uncommented product reference (required)
 *    9. Changed
 *    10. Changed
 */

import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shippingInfo: {
      address: {
        type: String,
        required: [true, "Please enter shipping address"],
      },
      city: {
        type: String,
        required: [true, "Please enter city"],
      },
      state: {
        type: String,
        required: [true, "Please enter state"],
      },
      country: {
        type: String,
        required: [true, "Please enter country"],
      },
      pinCode: {
        type: Number,
        required: [true, "Please enter pin code"],
      },
      phoneNo: {
        type: Number,
        required: [true, "Please enter phone number"],
      },
    },

    // 🛒 Order Items
    orderItems: [
      {
        name: {
          type: String,
          required: [true, "Please enter product name"],
        },
        price: {
          type: Number,
          required: [true, "Please enter product price"],
        },
        quantity: {
          type: Number,
          required: [true, "Please enter quantity"],
        },
        image: {
          type: String,
          required: [true, "Please enter product image"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Please enter product ID"],
        },
      },
    ],

    // 👤 User who placed the order
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please enter user ID"],
    },

    // 💳 Payment Information
    paymentInfo: {
      id: {
        type: String,
        required: [true, "Please enter payment ID"],
      },
      status: {
        type: String,
        required: [true, "Please enter payment status"],
      },
    },

    // 📅 Payment Date
    paidAt: {
      type: Date,
      required: [true, "Please enter payment date"],
    },

    // 💰 Price Breakdown
    itemsPrice: {
      type: Number,
      required: [true, "Please enter items price"],
      default: 0,
    },
    taxPrice: {
      type: Number,
      required: [true, "Please enter tax price"],
      default: 0,
    },
    shippingPrice: {
      type: Number,
      required: [true, "Please enter shipping price"],
      default: 0,
    },
    totalPrice: {
      type: Number,
      required: [true, "Please enter total price"],
      default: 0,
    },

    orderStatus: {
      type: String,
      enum: {
        values: ["Processing", "Shipped", "Delivered"],
        message: "Please select correct order status",
      },
      default: "Processing",
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Order", orderSchema);
