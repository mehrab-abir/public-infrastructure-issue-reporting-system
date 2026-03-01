const { getCollections } = require("../config/mongo");

function generateTrackingId() {
    const prefix = "TRK-CTFX";
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    return `${prefix}-${random}-${timestamp}`;
}

const logTracking = async (trackingId, issueId, issueStatus, updatedBy) => {
    const { trackingCollection } = getCollections();

    const log = {
        trackingId,
        issueStatus,
        issueId,
        updatedBy,
        updated_at: new Date(),
    };

    return trackingCollection.insertOne(log);
};

module.exports = { generateTrackingId, logTracking };