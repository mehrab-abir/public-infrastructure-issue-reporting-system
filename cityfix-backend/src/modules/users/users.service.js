const { getCollections } = require("../../config/mongo");

exports.getUserRole = async (email) => {
    const { usersCollection } = getCollections();

    const userRole = await usersCollection.findOne(
        { email },
        { projection: { role: 1 } }
    );

    return { role: userRole?.role };
};

exports.createUser = async (newUser) => {
    const { usersCollection } = getCollections();

    const userExists = await usersCollection.findOne({ uid: newUser.uid });
    if (userExists) return { userExists: "user already exists, not posted" };

    return usersCollection.insertOne(newUser);
};

exports.updateProfile = async (email, role, body) => {
    const { usersCollection, staffCollection } = getCollections();
    const { displayName, photoURL } = body;

    // name update
    if (displayName) {
        if (role === "citizen" || role === "admin") {
            const updateName = await usersCollection.updateOne(
                { email },
                { $set: { displayName } }
            );

            if (updateName.modifiedCount) {
                return { acknowledge: true, message: "name updated", statusText: "OK" };
            }
            return { acknowledge: false, message: "name not updated" };
        }

        if (role === "staff") {
            const updateStaffName = await staffCollection.updateOne(
                { email },
                { $set: { displayName } }
            );

            const updateUserName = await usersCollection.updateOne(
                { email },
                { $set: { displayName } }
            );

            if (updateStaffName.modifiedCount && updateUserName.modifiedCount) {
                return { acknowledge: true, message: "staff and user document updated", statusText: "OK" };
            }
            return { acknowledge: false, message: "staff name not updated" };
        }
    }

    // photo update
    if (photoURL) {
        if (role === "citizen" || role === "admin") {
            const updatePhoto = await usersCollection.updateOne(
                { email },
                { $set: { photoURL } }
            );

            if (updatePhoto.modifiedCount) {
                return { acknowledge: true, message: "photo updated", statusText: "OK" };
            }
            return { acknowledge: false, message: "photo not updated" };
        }

        if (role === "staff") {
            const updateStaffPhoto = await staffCollection.updateOne(
                { email },
                { $set: { photoURL } }
            );

            const updateUserPhoto = await usersCollection.updateOne(
                { email },
                { $set: { photoURL } }
            );

            if (updateStaffPhoto.modifiedCount && updateUserPhoto.modifiedCount) {
                return { acknowledge: true, message: "staff and user document updated", statusText: "OK" };
            }
            return { acknowledge: false, message: "staff photo not updated" };
        }
    }

    return { acknowledge: false, message: "nothing to update" };
};

exports.getUserByUid = async (uid) => {
    const { usersCollection } = getCollections();
    return usersCollection.findOne({ uid });
};