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
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please enter user ID"],
    },
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
    paidAt: {
      type: Date,
      required: [true, "Please enter payment date"],
    },
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
