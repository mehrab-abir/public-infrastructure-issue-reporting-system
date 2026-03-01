const { getCollections, ObjectId } = require("../../config/mongo");
const { admin } = require("../../config/firebase");
const { logTracking } = require("../../utils/tracking");

exports.getAllUsers = async ({ role, searchText, recent }) => {
    const { usersCollection } = getCollections();

    const query = {};
    if (role) query.role = role;

    if (searchText) {
        query.$or = [
            { displayName: { $regex: searchText, $options: "i" } },
            { email: { $regex: searchText, $options: "i" } },
        ];
    }

    const cursor = usersCollection.find(query).sort({ created_at: -1 });

    const limit = Number(recent);
    if (limit) cursor.limit(limit);

    return cursor.toArray();
};

exports.rejectIssue = async ({ issueId, trackingId }) => {
    const { issueCollection } = getCollections();

    const rejectedIssue = await issueCollection.updateOne(
        { _id: new ObjectId(issueId) },
        { $set: { status: "Rejected" } }
    );

    await logTracking(trackingId, issueId, "Rejected", "Admin");
    return rejectedIssue;
};

exports.getAllStaffs = async ({ searchText, recent }) => {
    const { staffCollection } = getCollections();

    const query = {};
    if (searchText) {
        query.$or = [{ displayName: { $regex: searchText, $options: "i" } }];
    }

    const cursor = staffCollection.find(query).sort({ created_at: -1 });

    const limit = Number(recent);
    if (limit) cursor.limit(limit);

    return cursor.toArray();
};

exports.assignStaff = async ({ issueId, trackingId, staffEmail, staffName }) => {
    const { issueCollection } = getCollections();

    const issueStatus = "Staff Assigned";

    const issueAssigned = await issueCollection.updateOne(
        { _id: new ObjectId(issueId) },
        { $set: { staffEmail, status: issueStatus } }
    );

    await logTracking(trackingId, issueId, `${issueStatus} - ${staffName}`, "Admin");
    return issueAssigned;
};

exports.deleteIssue = async (issueId) => {
    const { issueCollection } = getCollections();
    return issueCollection.deleteOne({ _id: new ObjectId(issueId) });
};

exports.registerStaff = async (newStaff) => {
    const { staffCollection, usersCollection } = getCollections();

    const staff = await admin.auth().createUser({
        email: newStaff.email,
        password: newStaff.password,
        displayName: newStaff.displayName,
        photoURL: newStaff.photoURL,
    });

    const staffDoc = {
        uid: staff.uid,
        email: newStaff.email,
        displayName: newStaff.displayName,
        photoURL: newStaff.photoURL,
        phone: newStaff.phone,
        role: "staff",
        created_at: new Date(),
    };

    await staffCollection.insertOne(staffDoc);
    await usersCollection.insertOne(staffDoc);

    return {
        acknowledge: true,
        message: "staff account created",
        staffEmail: staff.email,
        uid: staff.uid,
    };
};

exports.updateStaff = async (uid, { displayName, phone, photoURL }) => {
    const { staffCollection, usersCollection } = getCollections();

    await admin.auth().updateUser(uid, { displayName, photoURL });

    const updatedStaff = await staffCollection.updateOne(
        { uid },
        { $set: { displayName, phone, photoURL } }
    );

    const updatedUser = await usersCollection.updateOne(
        { uid },
        { $set: { displayName, phone, photoURL } }
    );

    if (updatedStaff.matchedCount && updatedUser.matchedCount) {
        return {
            message: "updated",
            updated: true,
            staffMatched: updatedStaff.matchedCount,
            userMatched: updatedUser.matchedCount,
        };
    }

    throw new Error("Error: update in db failed");
};

exports.deleteStaff = async (uid) => {
    const { staffCollection, usersCollection } = getCollections();

    await admin.auth().deleteUser(uid);

    const deletedFromStaff = await staffCollection.deleteOne({ uid });
    const deletedUser = await usersCollection.deleteOne({ uid });

    if (deletedFromStaff.deletedCount && deletedUser.deletedCount) {
        return { deleted: true, message: "user deleted" };
    }

    throw new Error("failed to delete user");
};

exports.toggleBlockUser = async (email) => {
    const { usersCollection } = getCollections();

    const thisUser = await usersCollection.findOne({ email });
    const nextBlockValue = !thisUser?.block;

    return usersCollection.updateOne(
        { email },
        { $set: { block: nextBlockValue } }
    );
};

exports.toggleAdminRole = async(email, newRole)=>{
    const {usersCollection} = getCollections();

    const thisUser = await usersCollection.findOne({email});
    const currentRole = thisUser?.role;

    const updatedRole = newRole;

    const afterUpdate = await usersCollection.updateOne({email},{
        $set : {
            role : updatedRole,
            previousRole : currentRole
        }
    })

    return afterUpdate;
}

exports.allPayments = async () => {
    const { paymentCollection } = getCollections();
    return paymentCollection.find().sort({ paid_at: -1 }).toArray();
};

exports.subscriptionPayments = async () => {
    const { subscriptionPayments } = getCollections();
    return subscriptionPayments.find().sort({ paid_at: -1 }).toArray();
};