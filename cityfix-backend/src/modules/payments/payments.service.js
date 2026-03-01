const { stripe } = require("../../config/stripe");
const { env } = require("../../config/env");
const { getCollections, ObjectId } = require("../../config/mongo");
const { logTracking } = require("../../utils/tracking");

exports.createBoostCheckout = async (paymentInfo) => {
    const amount = Number(paymentInfo.boostFee) * 100;

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: "USD",
                    unit_amount: amount,
                    product_data: { name: paymentInfo.issueTitle },
                },
                quantity: 1,
            },
        ],
        customer_email: paymentInfo.reporterEmail,
        mode: "payment",
        metadata: {
            issueId: paymentInfo.issueId,
            issueTitle: paymentInfo.issueTitle,
            trackingId: paymentInfo.trackingId,
            reporterEmail: paymentInfo.reporterEmail,
        },
        success_url: `${env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.SITE_DOMAIN}/dashboard/payment-cancelled`,
    });

    return { url: session.url };
};

exports.boostPaymentSuccess = async (sessionId) => {
    const { issueCollection, paymentCollection } = getCollections();

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const transactionId = session.payment_intent;

    const paymentExist = await paymentCollection.findOne({ transactionId });
    if (paymentExist) {
        return {
            message: "Payment already exists",
            transactionId,
            issueTitle: paymentExist.issueTitle,
        };
    }

    if (session.payment_status !== "paid") {
        return { message: "Payment not completed" };
    }

    const issueId = session.metadata.issueId;
    const paymentDate = new Date();
    const trackingId = session.metadata.trackingId;
    const reporter = session.metadata.reporterEmail.split("@")[0];

    await logTracking(trackingId, issueId, "Issue Boosted for High Priority", reporter);

    const updatedPriority = await issueCollection.updateOne(
        { _id: new ObjectId(issueId) },
        { $set: { priority: "High", priorityLevel: 1, boosted_at: paymentDate } }
    );

    const payment = {
        issueTitle: session.metadata.issueTitle,
        issueId: session.metadata.issueId,
        transactionId,
        paid_at: paymentDate,
        paymentPurpose: "Boost Issue",
        reporterEmail: session.metadata.reporterEmail,
        amount: session.amount_total / 100,
        currency: session.currency,
    };

    const postPayment = await paymentCollection.insertOne(payment);

    return { success: true, updatedPriority, postPayment, transactionId };
};

exports.createSubscriptionCheckout = async (paymentInfo) => {
    const amount = 1000 * 100;

    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    unit_amount: amount,
                    currency: "USD",
                    product_data: { name: "Premium Subscription - CityFix" },
                },
                quantity: 1,
            },
        ],
        customer_email: paymentInfo.userEmail,
        mode: "payment",
        metadata: { userEmail: paymentInfo.userEmail },
        success_url: `${env.SITE_DOMAIN}/subscription/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${env.SITE_DOMAIN}/subscription/payment-cancelled`,
    });

    return { url: session.url };
};

exports.subscriptionPaymentSuccess = async (sessionId) => {
    const { usersCollection, subscriptionPayments } = getCollections();

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const transactionId = session.payment_intent;

    const paymentExist = await subscriptionPayments.findOne({ transactionId });
    if (paymentExist) return { message: "Payment already exists", transactionId };

    if (session.payment_status !== "paid") return { message: "Payment not completed" };

    const userEmail = session.metadata.userEmail;
    const paymentDate = new Date();

    const updatedUser = await usersCollection.updateOne(
        { email: userEmail },
        { $set: { isPremium: "yes", subscribed_at: paymentDate } }
    );

    const payment = {
        transactionId,
        paid_at: paymentDate,
        paymentPurpose: "Subscription",
        userEmail,
        amount: session.amount_total / 100,
        currency: session.currency,
    };

    const postPayment = await subscriptionPayments.insertOne(payment);

    return { success: true, updatedUser, postPayment, transactionId };
};

exports.getCitizenPaymentHistory = async (email, recent) => {
    const { paymentCollection } = getCollections();

    const cursor = paymentCollection.find({ reporterEmail: email }).sort({ paid_at: -1 });

    const limit = Number(recent);
    if (limit) cursor.limit(limit);

    return cursor.toArray();
};

exports.getCitizenSubscriptionPayment = async (email) => {
    const { subscriptionPayments } = getCollections();
    return subscriptionPayments.findOne({ userEmail: email });
};