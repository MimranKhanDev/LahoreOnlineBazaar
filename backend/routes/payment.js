import express from "express";
const router = express.Router();
import { isAuthenticatedUser } from "../middlewares/auth.js";
import {
  stripeCheckoutSession,
  stripeWebhook,
  processPayment,
  sendStripeApiKey,
} from "../controllers/paymentControllers.js";

// ============= 💳 TUTORIAL COMPATIBLE ENDPOINTS =============
router.route("/payment/process").post(isAuthenticatedUser, processPayment);
router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);

// ============= 💳 YOUR CHECKOUT SESSION ENDPOINTS =============
router
  .route("/payment/checkout_session")
  .post(isAuthenticatedUser, stripeCheckoutSession);
router.route("/payment/webhook").post(stripeWebhook);

export default router;
