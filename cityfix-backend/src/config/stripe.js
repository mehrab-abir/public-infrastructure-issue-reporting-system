const { env } = require("./env");
const stripe = require("stripe")(env.STRIPE_SECRET);
module.exports = { stripe };