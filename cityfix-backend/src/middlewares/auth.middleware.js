const { admin } = require("../config/firebase");
const { getCollections } = require("../config/mongo");

const verifyToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: "unauthorized access" });
    }

    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
        return res.status(401).send({ message: "unauthorized access" });
    }

    try {
        const decode = await admin.auth().verifyIdToken(token);
        req.token_email = decode.email;
        next();
    } catch {
        return res.status(401).send({ message: "unauthorized access" });
    }
};

const verifyRole = (role) => {
    return async (req, res, next) => {
        const { usersCollection } = getCollections();
        const email = req.token_email;

        const user = await usersCollection.findOne({ email });

        if (!user || user.role !== role) {
            return res.status(403).send({ message: "forbidden access" });
        }

        next();
    };
};

const verifyAdmin = verifyRole("admin");
const verifyCitizen = verifyRole("citizen");
const verifyStaff = verifyRole("staff");

module.exports = { verifyToken, verifyAdmin, verifyCitizen, verifyStaff };