const router = require("express").Router();
const controller = require("./payments.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

router.post("/create-checkout-session", verifyToken, controller.createBoostCheckout);
router.patch("/payment-success", controller.boostPaymentSuccess);

router.post("/subscribe/create-checkout-session", verifyToken, controller.createSubscriptionCheckout);
router.patch("/subscription/payment-success", controller.subscriptionPaymentSuccess);

router.get("/citizen/payment-history/:email", verifyToken, controller.getCitizenPaymentHistory);
router.get("/citizen/subscription-payment/:email", verifyToken, controller.getCitizenSubscriptionPayment);

module.exports = router;