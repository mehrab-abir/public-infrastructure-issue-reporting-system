const { getCollections, ObjectId } = require("../../config/mongo");
const { logTracking } = require("../../utils/tracking");

exports.getAssignedIssues = async (email, { searchText, priority }) => {
    const { issueCollection } = getCollections();

    const query = { staffEmail: email };
    if (priority) query.priority = priority;

    if (searchText) {
        query.$or = [{ issueTitle: { $regex: searchText, $options: "i" } }];
    }

    return issueCollection.find(query).sort({ created_at: -1 }).toArray();
};

exports.updateIssueStatus = async ({ staffResponse, staffEmail, issueId, trackingId }) => {
    const { issueCollection, resolvedCollection } = getCollections();

    let issueStatus = "";

    if (staffResponse === "accept") issueStatus = "In Progress";
    else if (staffResponse === "Working") issueStatus = "Working";
    else if (staffResponse === "Resolved") {
        issueStatus = "Resolved";
        await resolvedCollection.insertOne({
            issueId: new ObjectId(issueId),
            resolved_at: new Date(),
            staffEmail,
        });
    } else if (staffResponse === "Closed") issueStatus = "Closed";
    else {
        issueStatus = "Pending";
        staffEmail = "";
    }

    const updated = await issueCollection.updateOne(
        { _id: new ObjectId(issueId) },
        { $set: { status: issueStatus, staffEmail } }
    );

    if (issueStatus !== "Pending") {
        await logTracking(trackingId, issueId, issueStatus, "Staff");
    }

    return updated;
};

exports.getResolvedIssues = async (email, recent) => {
    const { resolvedCollection } = getCollections();

    const cursor = resolvedCollection.aggregate([
        { $match: { staffEmail: email } },
        { $sort: { resolved_at: -1 } },
        {
            $lookup: {
                from: "issues",
                localField: "issueId",
                foreignField: "_id",
                as: "resolved_issue",
            },
        },
        { $unwind: "$resolved_issue" },
    ]);

    const limit = Number(recent);
    if (limit) cursor.limit(limit);

    const resolvedIssues = await cursor.toArray();
    const totalCount = await resolvedCollection.countDocuments({ staffEmail: email });

    return { resolvedIssues, totalCount };
};