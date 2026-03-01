const { getCollections, ObjectId } = require("../../config/mongo");
const { generateTrackingId, logTracking } = require("../../utils/tracking");

exports.createIssue = async (newIssue) => {
    const { issueCollection, usersCollection } = getCollections();

    const trackingId = generateTrackingId();
    newIssue.trackingId = trackingId;

    const afterPost = await issueCollection.insertOne(newIssue);

    const issueId = afterPost.insertedId.toString();
    const reporter = newIssue.reporterEmail.split("@")[0];

    await logTracking(trackingId, issueId, "Issue Reported", reporter);

    await usersCollection.updateOne(
        { email: newIssue.reporterEmail },
        { $inc: { issueReported: 1 } }
    );

    return afterPost;
};

exports.editIssue = async (issueId, body) => {
    const { issueCollection } = getCollections();
    const { issueTitle, category, description, location, photoURL } = body;

    return issueCollection.updateOne(
        { _id: new ObjectId(issueId) },
        { $set: { issueTitle, category, description, location, photoURL } }
    );
};

exports.getMyIssues = async (email, recent) => {
    const { issueCollection } = getCollections();
    const cursor = issueCollection.find({ reporterEmail: email }).sort({ created_at: -1 });

    const limit = Number(recent);
    if (limit) cursor.limit(limit);

    return cursor.toArray();
};

exports.deleteIssue = async (issueId) => {
    const { issueCollection } = getCollections();
    return issueCollection.deleteOne({ _id: new ObjectId(issueId) });
};

exports.upvoteIssue = async ({ issueId, upvoteBy }) => {
    const { issueCollection } = getCollections();

    const issue = await issueCollection.findOne(
        { _id: new ObjectId(issueId) },
        { projection: { upvoteBy: 1 } }
    );

    const already = issue?.upvoteBy?.includes(upvoteBy);

    if (already) {
        await issueCollection.updateOne(
            { _id: new ObjectId(issueId) },
            { $pull: { upvoteBy }, $inc: { upvote: -1 } }
        );
    } else {
        await issueCollection.updateOne(
            { _id: new ObjectId(issueId) },
            { $addToSet: { upvoteBy }, $inc: { upvote: 1 } }
        );
    }

    const updated = await issueCollection.findOne(
        { _id: new ObjectId(issueId) },
        { projection: { upvoteBy: 1, upvote: 1 } }
    );

    return {
        upvote: updated.upvote,
        upvoted: updated?.upvoteBy?.includes(upvoteBy),
    };
};

exports.getAllIssues = async (queryParams) => {
    const { issueCollection } = getCollections();
    const { category, status, priority, searchText, recent, skip } = queryParams;

    const query = {};
    if (category) query.category = category;
    if (status) query.status = status;
    if (priority) query.priority = priority;

    if (searchText) {
        query.$or = [
            { issueTitle: { $regex: searchText, $options: "i" } },
            { category: { $regex: searchText, $options: "i" } },
            { location: { $regex: searchText, $options: "i" } },
            { staffEmail: { $regex: searchText, $options: "i" } },
        ];
    }

    const cursor = issueCollection.find(query).sort({ priorityLevel: 1, created_at: -1 });

    const limit = Number(recent) || 0;
    const skipNum = Number(skip) || 0;

    if (limit) cursor.limit(limit);
    if (skipNum) cursor.skip(skipNum);

    const issues = await cursor.toArray();
    const totalCount = await issueCollection.countDocuments();

    return { issues, totalCount };
};

exports.getIssueDetails = async (issueId) => {
    const { issueCollection } = getCollections();
    return issueCollection.findOne({ _id: new ObjectId(issueId) });
};

exports.getTimeline = async (issueId) => {
    const { trackingCollection } = getCollections();
    return trackingCollection.find({ issueId }).sort({ updated_at: -1 }).toArray();
};

exports.getIssueReporterInfo = async ({ reporterEmail, staffEmail }) => {
    const { usersCollection, staffCollection } = getCollections();

    const reporter = reporterEmail ? await usersCollection.findOne({ email: reporterEmail }) : {};
    const staff = staffEmail ? await staffCollection.findOne({ email: staffEmail }) : {};

    return { reporter: reporter || {}, staff: staff || {} };
};

exports.getLatestResolved = async () => {
    const { resolvedCollection } = getCollections();

    return resolvedCollection.aggregate([
        { $sort: { resolved_at: -1 } },
        { $limit: 6 },
        {
            $lookup: {
                from: "issues",
                localField: "issueId",
                foreignField: "_id",
                as: "resolved_issue",
            },
        },
        { $unwind: "$resolved_issue" },
    ]).toArray();
};