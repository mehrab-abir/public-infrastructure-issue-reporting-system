const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { env } = require("./env");

const client = new MongoClient(env.URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let db = null;

const connectMongo = async () => {
    if (db) return db;
    await client.connect();
    db = client.db("cityfix-db");
    console.log("MongoDB connected");
    return db;
};

const getCollections = () => {
    if (!db) throw new Error("MongoDB not connected yet. Call connectMongo() first.");

    return {
        usersCollection: db.collection("users"),
        issueCollection: db.collection("issues"),
        staffCollection: db.collection("staffs"),
        trackingCollection: db.collection("trackingLogs"),
        paymentCollection: db.collection("boost-payments"),
        subscriptionPayments: db.collection("subscription-payments"),
        resolvedCollection: db.collection("resolved-issues"),
    };
};

module.exports = { connectMongo, getCollections, ObjectId };