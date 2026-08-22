// backend/controllers/paymentControllers.js

/**
 * 💳 PAYMENT CONTROLLERS - Stripe payment integration
 *
 * This file handles:
 * 1. Stripe checkout session creation
 * 2. Stripe webhook handling
 *
 * 🔄 API ENDPOINTS:
 *    POST /api/v1/payment/checkout_session - Create checkout session
 *    POST /api/v1/payment/webhook          - Stripe webhook
 *
 * ⚠️ IMPORTANT: Your frontend expects the tutorial's approach
 *    The tutorial uses: /api/v1/payment/process → paymentIntents.create()
 *    We're adapting to use: /api/v1/payment/checkout_session → checkout.sessions.create()
 *
 * ✅ FIX: Added both approaches for compatibility
 */

import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : null;

/**
 * 💳 Create Stripe Checkout Session
 *
 * 📥 Body: { orderItems, shippingInfo, itemsPrice }
 * 📤 Returns: { url }
 *
 * ✅ FIX: Added fallback for tutorial's payment/process endpoint
 */
export const stripeCheckoutSession = catchAsyncErrors(
  async (req, res, next) => {
    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: "Stripe is not configured on this server.",
      });
    }
    const { orderItems, shippingInfo, itemsPrice } = req.body;
    // ✅ Build line items for checkout
    const line_items = orderItems.map((item) => ({
      price_data: {
        currency: "dollar",
        product_data: {
          name: item.name,
          images: [item.image],
          metadata: {
            productId: item.product,
          },
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    // ✅ Determine shipping rate (free over $100)
    const shippingRate =
      itemsPrice >= 100
        ? "shr_1LlBW5A7jBHqn8SBG2fsAWwT"
        : "shr_1NQYwEA7jBHqn8SBs5alau8k";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      success_url: `${process.env.FRONTEND_URL}/success?order_success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      customer_email: req.user.email,
      client_reference_id: req.user._id.toString(),
      mode: "payment",
      metadata: {
        ...shippingInfo,
        itemsPrice: itemsPrice.toString(),
      },
      shipping_options: [{ shipping_rate: shippingRate }],
      line_items,
    });
    res.status(200).json({
      success: true,
      url: session.url,
    });
  },
);

/**
 * 🔔 Stripe Webhook
 *
 * ✅ FIX: Added success field to response
 */
export const stripeWebhook = catchAsyncErrors(async (req, res, next) => {
  try {
    if (!stripe) {
      return res.status(500).json({
        success: false,
        message: "Stripe is not configured on this server.",
      });
    }
    const signature = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const line_items = await stripe.checkout.sessions.listLineItems(
        session.id,
      );
      // ✅ Get order items from session
      const orderItems = await getOrderItems(line_items);
      const user = session.client_reference_id;
      const totalAmount = session.amount_total / 100;
      const taxAmount = session.total_details.amount_tax / 100;
      const shippingAmount = session.total_details.amount_shipping / 100;
      const itemsPrice = parseFloat(session.metadata.itemsPrice);
      const shippingInfo = {
        address: session.metadata.address,
        city: session.metadata.city,
        phoneNo: session.metadata.phoneNo,
        pinCode: session.metadata.pinCode,
        country: session.metadata.country,
      };
      const paymentInfo = {
        id: session.payment_intent,
        status: session.payment_status,
      };
      // ✅ Create order
      await Order.create({
        shippingInfo,
        orderItems,
        itemsPrice,
        taxPrice: taxAmount,
        shippingPrice: shippingAmount,
        totalPrice: totalAmount,
        paymentInfo,
        paymentMethod: "Card",
        user,
      });
    }
    res.status(200).json({
      success: true, // ✅ Added
    });
  } catch (error) {
    console.log("Stripe Webhook Error => ", error);
    res.status(400).json({
      success: false,
    });
  }
});

/**
 * 🛒 Helper: Get Order Items from Stripe
 */
const getOrderItems = async (line_items) => {
  const cartItems = await Promise.all(
    line_items.data.map(async (item) => {
      const product = await stripe.products.retrieve(item.price.product);
      return {
        product: product.metadata.productId,
        name: product.name,
        price: item.price.unit_amount / 100,
        quantity: item.quantity,
        image: product.images[0],
      };
    }),
  );
  return cartItems;
};

/**
 * 💳 TUTORIAL COMPATIBILITY ENDPOINTS
 *
 * These endpoints match the tutorial's frontend expectations
 * They use the same paymentIntents.create() approach
 */

/**
 * 💳 Process Payment (Tutorial compatible)
 *
 * 📥 Body: { amount }
 * 📤 Returns: { success: true, client_secret }
 *
 * ⚠️ This matches the tutorial's /api/v1/payment/process endpoint
 */
export const processPayment = catchAsyncErrors(async (req, res, next) => {
  if (!stripe) {
    return res.status(500).json({
      success: false,
      message: "Stripe is not configured on this server.",
    });
  }
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });
  res.status(200).json({
    success: true,
    client_secret: myPayment.client_secret,
  });
});

/**
 * 🔑 Send Stripe API Key (Tutorial compatible)
 *
 * 📤 Returns: { stripeApiKey }
 *
 * ⚠️ This matches the tutorial's /api/v1/stripeapikey endpoint
 */
export const sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_API_KEY,
  });
});
