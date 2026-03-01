const { getCollections } = require("../../config/mongo");

exports.issueCount = async () => {
    const { issueCollection } = getCollections();
    return issueCollection.countDocuments();
};

exports.citizenCount = async () => {
    const { usersCollection } = getCollections();
    return usersCollection.countDocuments({ role: "citizen" });
};

exports.staffCount = async () => {
    const { staffCollection } = getCollections();
    return staffCollection.countDocuments();
};

exports.totalRevenue = async () => {
    const { paymentCollection, subscriptionPayments } = getCollections();

    const boostIssueRevenue = await paymentCollection.aggregate([
        {
            $group: {
                _id: null,
                totalBoost: { $sum: { $toInt: "$amount" } },
            },
        },
    ]).toArray();

    const subscriptionRevenue = await subscriptionPayments.aggregate([
        {
            $group: {
                _id: null,
                totalSubscription: { $sum: { $toInt: "$amount" } },
            },
        },
    ]).toArray();

    const revenue =
        (boostIssueRevenue[0]?.totalBoost || 0) +
        (subscriptionRevenue[0]?.totalSubscription || 0);

    return revenue;
};

exports.groupIssuesByStatus = async (email) => {
    const { issueCollection } = getCollections();

    const matchedStaff = email ? { staffEmail: email } : {};

    return issueCollection.aggregate([
        { $match: matchedStaff },
        { $group: { _id: "$status", count: { $sum: 1 } } },
    ]).toArray();
};

exports.groupIssuesByMonths = async () => {
    const { issueCollection } = getCollections();

    return issueCollection.aggregate([
        {
            $addFields: {
                created_at: { $toDate: "$created_at" },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$created_at" },
                    month: { $month: "$created_at" },
                },
                count: { $sum: 1 },
            },
        },
    ]).toArray();
};

exports.citizenIssueCountByStatus = async (email) => {
    const { issueCollection } = getCollections();

    return issueCollection.aggregate([
        { $match: { reporterEmail: email } },
        {
            $facet: {
                byStatus: [
                    { $group: { _id: "$status", count: { $sum: 1 } } },
                ],
                total: [
                    { $group: { _id: null, totalCount: { $sum: 1 } } },
                ],
            },
        },
    ]).toArray();
};