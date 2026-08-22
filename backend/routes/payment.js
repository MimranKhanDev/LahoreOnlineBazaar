// backend/routes/payment.js

/**
 * 💳 PAYMENT ROUTES - Stripe Payment Integration
 *
 * This file defines ALL payment-related API endpoints
 *
 * 🔄 API ENDPOINTS:
 *    POST   /api/v1/payment/process     - Process payment (tutorial)
 *    GET    /api/v1/stripeapikey        - Get Stripe API key (tutorial)
 *    POST   /api/v1/payment/checkout_session - Create checkout session (your version)
 *    POST   /api/v1/payment/webhook     - Stripe webhook
 *
 * ✅ FIXES MADE:
 *    1. Added tutorial-compatible endpoints
 *    2. Kept your checkout session endpoints
 *    3. Added processPayment and sendStripeApiKey
 */

import express from "express";
const router = express.Router();

// ✅ Import middleware
import { isAuthenticatedUser } from "../middlewares/auth.js";

import {
  stripeCheckoutSession,
  stripeWebhook,
  processPayment,
  sendStripeApiKey,
} from "../controllers/paymentControllers.js";

// ============= 💳 TUTORIAL COMPATIBLE ENDPOINTS =============

// 💳 Process payment (tutorial way)
router.route("/payment/process").post(isAuthenticatedUser, processPayment);

// 🔑 Get Stripe API key (tutorial way)
router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);

// ============= 💳 YOUR CHECKOUT SESSION ENDPOINTS =============

// 🛒 Create checkout session (your way)
router
  .route("/payment/checkout_session")
  .post(isAuthenticatedUser, stripeCheckoutSession);

// 🔔 Stripe webhook (your way)
router.route("/payment/webhook").post(stripeWebhook);

export default router;
