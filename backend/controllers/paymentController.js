const express = require("express");
const router = express.Router();
const { isAuthenticatedUser } = require("../middleware/auth");
const { processPayment, sendStripeApiKey } = require("../routes/paymentRoute");

router.route("/payment/process").post(isAuthenticatedUser, processPayment);

router.route("/stripeapikey").post(isAuthenticatedUser, sendStripeApiKey);

module.exports = router;
