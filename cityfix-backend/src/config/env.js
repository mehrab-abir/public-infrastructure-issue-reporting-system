require("dotenv").config();

const env = {
    PORT: process.env.PORT || 3000,
    URI: process.env.URI,
    STRIPE_SECRET: process.env.STRIPE_SECRET,
    SITE_DOMAIN: process.env.SITE_DOMAIN,
    FIREBASE_SERVICE_KEY: process.env.FIREBASE_SERVICE_KEY,
};

module.exports = { env };