const express = require('express');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 3000;
const uri = `${process.env.URI}`;
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const admin = require("firebase-admin");

const decoded = Buffer.from(process.env.FIREBASE_SERVICE_KEY, "base64").toString("utf8");
const serviceAccount = JSON.parse(decoded);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.use(express.json());
app.use(cors());

//middleware, --verify token
const verifyToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).send({ message: "unauthorized access" });
    }

    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).send({ message: "unauthorized access" });
    }

    try {
        const decode = await admin.auth().verifyIdToken(token);
        req.token_email = decode.email;
        // console.log(decode.uid);

        next();
    }
    catch {
        return res.status(401).send({ message: "unauthorized access" });
    }
}

//generate tracking id
function generateTrackingId() {
    const prefix = "TRK-CTFX";
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);

    return `${prefix}-${random}-${timestamp}`;
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/', (req, res) => {
    res.send("CityFix server is running");
})

async function run() {
    try {
        // await client.connect();

        const db = client.db("cityfix-db");
        const usersCollection = db.collection("users");
        const issueCollection = db.collection("issues");
        const staffCollection = db.collection("staffs");
        const trackingCollection = db.collection("trackingLogs");
        const paymentCollection = db.collection("boost-payments");
        const subscriptionPayments = db.collection("subscription-payments");
        const resolvedCollection = db.collection("resolved-issues");

        //middleware to verify role - admin
        const verifyAdmin = async (req, res, next) => {
            const email = req.token_email;
            const user = await usersCollection.findOne({ email });

            if (!user || user.role != "admin") {
                return res.status(403).send({ message: "forbidden access" });
            }
            next();
        }

        const verifyCitizen = async (req,res,next)=>{
            const email = req.token_email;
            const user = await usersCollection.findOne({email});

            if(!user || user.role !== "citizen"){
                return res.status(403).send({message : "forbidden access"});
            }
            next();
        }
        const verifyStaff = async (req,res,next)=>{
            const email = req.token_email;
            const user = await usersCollection.findOne({email});

            if(!user || user.role !== "staff"){
                return res.status(403).send({message : "forbidden access"});
            }
            next();
        }

        //log tracking
        const logTracking = async (trackingId, issueId, issueStatus, updatedBy) => {
            const log = {
                trackingId,
                issueStatus,
                issueId,
                updatedBy,
                updated_at: new Date()
            }

            const result = await trackingCollection.insertOne(log);
            return result;
        }

        // apis for users/citizens 
        //post an issue
        app.post("/issues", verifyToken, async (req, res) => {
            const newIssue = req.body;

            const trackingId = generateTrackingId();

            newIssue.trackingId = trackingId;

            const afterPost = await issueCollection.insertOne(newIssue);

            const issueId = afterPost.insertedId.toString();
            const reporter = newIssue.reporterEmail.split('@')[0];

            logTracking(trackingId, issueId, "Issue Reported", reporter); //1st tracking log

            res.send(afterPost);
        })

        //edit an issue - by the issue reporter
        app.patch('/edit-issue/:issueId',verifyToken, verifyCitizen, async (req, res) => {
            const { issueId } = req.params;
            const { issueTitle, category, description, location, photoURL } = req.body;
            const updatedIssue = await issueCollection.updateOne({ _id: new ObjectId(issueId) }, {
                $set: {
                    issueTitle: issueTitle,
                    category: category,
                    description: description,
                    location: location,
                    photoURL: photoURL,
                }
            })

            res.send(updatedIssue);
        })

        //get all my issues - issues reported by a citizen
        app.get("/issues/:email", verifyToken, verifyCitizen, async (req, res) => {
            const { email } = req.params;
            const {recent} = req.query;

            const result = issueCollection.find({ reporterEmail: email }).sort({created_at : -1});

            const limit = Number(recent);

            if(limit){
                result.limit(limit);
            }

            const issues = await result.toArray();

            res.send(issues);
        })

        //delete an issue - as citizen -from issueDetails page and My Issues page
        app.delete('/citizen/delete-issue/:issueId',verifyToken, verifyCitizen, async (req, res) => {
            const { issueId } = req.params;
            const deletedIssue = await issueCollection.deleteOne({ _id: new ObjectId(issueId) });
            res.send(deletedIssue);
        })


        //upvote issue by citizen
        app.patch('/upvote-issue', verifyToken, async (req, res) => {
            const { issueId, upvoteBy } = req.body;

            const issue = await issueCollection.findOne({ _id: new ObjectId(issueId) }, {
                projection: { upvoteBy: 1 }
            })

            const alreadyUpvoted = issue?.upvoteBy?.includes(upvoteBy);

            let afterClick;

            if (alreadyUpvoted) {
                afterClick = await issueCollection.updateOne({ _id: new ObjectId(issueId) }, {
                    $pull: { upvoteBy: upvoteBy },
                    $inc: { upvote: -1 }
                })
            }
            else {
                afterClick = await issueCollection.updateOne({ _id: new ObjectId(issueId) }, {
                    $addToSet: { upvoteBy: upvoteBy },
                    $inc: { upvote: 1 }
                })
            }

            const updated = await issueCollection.findOne({ _id: new ObjectId(issueId) }, {
                projection: { upvoteBy: 1, upvote: 1 }
            });

            res.send({
                modifiedCount: afterClick.modifiedCount,
                upvote: updated.upvote,
                upvoted: updated?.upvoteBy?.includes(upvoteBy)
            });
        })

        //get all assigned issue --for staff
        app.get("/staff/assigned-issues/:email",verifyToken,verifyStaff, async (req, res) => {
            const { email } = req.params;

            const myAssignedIssues = await issueCollection.find({ staffEmail: email }).sort({ created_at: -1 }).toArray();

            res.send(myAssignedIssues);
        })

        //update issue status by staff - accept/reject, in-progress, working, resolved, closed etc. -- 3rd, 4th, 5th... tracking log here
        app.patch("/staff/update-issue-status",verifyToken, verifyStaff, async (req, res) => {
            const { staffResponse, staffEmail, issueId, trackingId } = req.body;

            let issueStatus = '';

            if (staffResponse === "accept") {
                issueStatus = "In Progress";
            }
            else if (staffResponse === "Working") {
                issueStatus = "Working";
            }
            else if (staffResponse === "Resolved") {
                issueStatus = "Resolved";
                const resolved_at = new Date();

                await resolvedCollection.insertOne({
                    issueId: new ObjectId(issueId),
                    resolved_at,
                    staffEmail
                });

            }
            else if (staffResponse === "Closed") {
                issueStatus = "Closed";
            }
            else {
                issueStatus = "Pending";
                staffEmail = '';
            }

            const thisIssue = await issueCollection.updateOne({ _id: new ObjectId(issueId) }, {
                $set: {
                    status: issueStatus,
                    staffEmail: staffEmail,
                }
            });

            //logging the tracking info if only the issueStatus updates to next stage, like from 'Pending' to "In Progress", "Working", or "Resolved" etc.

            /* if the staff rejects the issue, issue status will go back to "Pending", but it will not be logged into tracking*/
            if (issueStatus !== "Pending") {
                logTracking(trackingId, issueId, issueStatus, "Staff");
                //3rd, 4th, 5th...tracking log
            }

            res.send(thisIssue);
        })

        //get all resolved issues of a staff
        app.get(`/staff/resolved-issues/:email`,verifyToken, verifyStaff,async (req,res)=>{
            const {email} = req.params;
            const {recent} = req.query;

            const result = resolvedCollection.aggregate([
                {$match : {staffEmail : email}},
                {
                    $sort : {resolved_at : -1}
                },
                {
                    $lookup : {
                        from : 'issues',
                        localField : 'issueId',
                        foreignField : "_id",
                        as : "resolved_issue"
                    }
                },
                {$unwind : "$resolved_issue"}
            ]);

            const limit = Number(recent);

            if(recent){
                result.limit(limit);
            }

            const issues = await result.toArray();

            const resolvedCount = await resolvedCollection.countDocuments({staffEmail: email});

            res.send({
                resolvedIssue : issues,
                totalCount : resolvedCount
            });
        })

        


        //apis for admin
        //get all users
        app.get("/users",verifyToken, verifyAdmin, async (req, res) => {
            const { role, searchText, recent } = req.query;

            let query = {};

            if (role) {
                query.role = role;
            }

            if (searchText) {
                query.$or = [
                    { displayName: { $regex: searchText, $options: 'i' } },
                    { email: { $regex: searchText, $options: 'i' } }
                ]
            }

            const result = usersCollection.find(query).sort({ created_at: -1 });

            const limit = Number(recent);

            if (limit) {
                result.limit(limit);
            }

            const users = await result.toArray();

            res.send(users);
        })

        //reject issue - by admin
        app.patch('/admin/reject-issue',verifyToken,verifyAdmin, async (req, res) => {
            const { issueId, trackingId } = req.query;

            const rejectedIssue = await issueCollection.updateOne({ _id: new ObjectId(issueId) }, {
                $set: {
                    status: "Rejected"
                }
            })

            logTracking(trackingId, issueId, "Rejected", "Admin");

            res.send(rejectedIssue);
        })

        //get all staffs --for admin
        app.get("/all-staffs",verifyToken, verifyAdmin, async (req, res) => {
            const { searchText, recent } = req.query;

            let query = {};

            if (searchText) {
                query.$or = [
                    { displayName: { $regex: searchText, $options: 'i' } }
                ]
            }

            const result = staffCollection.find(query).sort({ created_at: -1 });

            const limit = Number(recent);

            if (limit) {
                result.limit(limit);
            }

            const staffs = await result.toArray();

            res.send(staffs);
        })

        //assign a staff to an issue --for admin
        app.patch("/assign-staff",verifyToken,verifyAdmin, async (req, res) => {
            const { issueId, trackingId, staffEmail, staffName } = req.body;

            const issueStatus = `Staff Assigned`;

            const issueAssigned = await issueCollection.updateOne({ _id: new ObjectId(issueId) }, {
                $set: {
                    staffEmail: staffEmail,
                    status: issueStatus
                }
            })

            logTracking(trackingId, issueId, `${issueStatus} - ${staffName}`, "Admin"); //2nd tracking log

            res.send(issueAssigned);
        })

        //get all issues
        app.get("/all-issues", async (req, res) => {
            const { category, status, priority, searchText, recent } = req.query;

            const query = {};

            //for filtering based on category, status, priority
            if (category) {
                query.category = category;
            }
            if (status) {
                query.status = status;
            }
            if (priority) {
                query.priority = priority;
            }

            if (searchText) {
                query.$or = [
                    { issueTitle: { $regex: searchText, $options: 'i' } },
                    { category: { $regex: searchText, $options: 'i' } },
                    { location: { $regex: searchText, $options: 'i' } },
                    { staffEmail: { $regex: searchText, $options: 'i' } }
                ]
            }

            const result = issueCollection.find(query).sort({ priorityLevel: 1, created_at: -1 });

            const limit = Number(recent);

            if (limit) {
                result.limit(limit);
            }

            const issues = await result.toArray();

            res.send(issues);
        })

        //get one issue details
        app.get("/issue/details/:issueId", async (req, res) => {
            const { issueId } = req.params;
            const thisIssue = await issueCollection.findOne({ _id: new ObjectId(issueId) });
            res.send(thisIssue);
        })

        //get timeline of one issue
        app.get('/timeline/:issueId', async (req, res) => {
            const { issueId } = req.params;
            const timeline = await trackingCollection.find({ issueId: issueId }).sort({ updated_at: -1 }).toArray();
            res.send(timeline);
        })

        //delete an issue - as admin
        app.delete("/admin/delete-issue/:issueId",verifyToken, verifyAdmin, async (req, res) => {
            const { issueId } = req.params;
            const deletedIssue = await issueCollection.deleteOne({ _id: new ObjectId(issueId) });
            res.send(deletedIssue);
        })

        //get reporter and staff info of an issue
        app.get('/issue-reporter', async (req, res) => {
            const { reporterEmail, staffEmail } = req.query;

            let reporter = {};
            if (reporterEmail) {
                reporter = await usersCollection.findOne({ email: reporterEmail });
            }

            let staff = {};
            if (staffEmail) {
                staff = await staffCollection.findOne({ email: staffEmail });
            }

            res.send({
                reporter: reporter || {},
                staff: staff || {}
            });
        })

        //create an account for staff and post to db
        app.post("/admin/register-staff", verifyToken, verifyAdmin, async (req, res) => {
            const newStaff = req.body;

            try {
                const staff = await admin.auth().createUser({
                    email: newStaff.email,
                    password: newStaff.password,
                    displayName: newStaff.displayName,
                    photoURL: newStaff.photoURL
                });

                //insert this staff into db
                const staffDoc = {
                    uid: staff.uid,
                    email: newStaff.email,
                    displayName: newStaff.displayName,
                    photoURL: newStaff.photoURL,
                    phone: newStaff.phone,
                    role: 'staff',
                    created_at: new Date()
                };

                await staffCollection.insertOne(staffDoc);
                await usersCollection.insertOne(staffDoc);

                res.send({
                    acknowledge: true,
                    message: "staff account created",
                    staffEmail: staff.email,
                    uid: staff.uid
                })
            }
            catch (err) {
                res.status(400).send({ message: err.message });
            }
        });

        //update staff info - by admin
        app.patch('/admin/update-staff/:uid', verifyToken, verifyAdmin, async (req, res) => {
            const { uid } = req.params;
            const { displayName, phone, photoURL } = req.body;

            try {
                const authInfo = {
                    displayName,
                    photoURL
                }

                //update in firebase auth system
                await admin.auth().updateUser(uid, authInfo);

                //update in staffCollection in db
                const updatedStaff = await staffCollection.updateOne({ uid }, {
                    $set: {
                        displayName: displayName,
                        phone: phone,
                        photoURL: photoURL
                    }
                })

                //update in userCollection in db
                const updatedUser = await usersCollection.updateOne({ uid }, {
                    $set: {
                        displayName: displayName,
                        phone: phone,
                        photoURL: photoURL
                    }
                })

                if (updatedStaff.matchedCount && updatedUser.matchedCount) {
                    res.send({
                        message: "updated",
                        updated: true,
                        staffMatched: updatedStaff.matchedCount,
                        userMatched: updatedUser.matchedCount,
                    })
                }
                else {
                    return res.status(500).send({
                        message: "Error: update in db failed",
                    })
                }
            }
            catch (err) {
                return res.status(500).send({
                    message: "Staff/user info has not updated",
                    errorMessage: `${err.message}`
                });
            }
        })

        //delete a staff - by admin
        app.delete('/admin/delete-staff/:uid', verifyToken, verifyAdmin, async (req, res) => {
            const { uid } = req.params;

            try {
                await admin.auth().deleteUser(uid);

                const deletedFromStaff = await staffCollection.deleteOne({ uid: uid });
                const deletedUser = await usersCollection.deleteOne({ uid: uid });

                if (deletedFromStaff.deletedCount && deletedUser.deletedCount) {
                    return res.send({
                        deleted: true,
                        message: "user deleted"
                    })
                }
            }
            catch (err) {
                console.log("Delet user error : ", err);
                return res.status(500).send({ message: "failed to delete user" });
            }
        })

        //get one user's role --for useRole
        app.get("/user/:email/role", async (req, res) => {
            const { email } = req.params;
            const userRole = await usersCollection.findOne({ email: email }, {
                projection: {
                    role: 1
                }
            });
            res.send({ role: userRole?.role });
        })

        //post user to db
        app.post("/users", async (req, res) => {
            const newUser = req.body;

            const userExists = await usersCollection.findOne({ uid: newUser.uid });

            if (userExists) {
                return res.send({ userExists: "user already exists, not posted" });
            }

            const result = await usersCollection.insertOne(newUser);

            res.send(result);
        })

        //update user profile -displayName or photURL
        app.patch("/update-profile/:email",verifyToken, async (req, res) => {
            const { displayName, photoURL } = req.body;
            const { email } = req.params;
            const { role } = req.query;

            if (displayName) {
                if (role === "citizen" || role === "admin") {
                    const updateName = await usersCollection.updateOne({ email: email }, {
                        $set: {
                            displayName: displayName
                        }
                    });

                    if (updateName.modifiedCount) {
                        res.send({
                            acknowledge: true,
                            message: "name updated",
                            statusText: "OK"
                        })
                    }
                    return;
                }

                if (role === "staff") {
                    const updateStaffName = await staffCollection.updateOne({ email: email }, {
                        $set: {
                            displayName: displayName
                        }
                    });
                    const updateUserName = await usersCollection.updateOne({ email: email }, {
                        $set: {
                            displayName: displayName
                        }
                    });

                    if (updateStaffName.modifiedCount && updateUserName.modifiedCount) {
                        res.send({
                            acknowledge: true,
                            message: "staff and user document updated",
                            statusText: "OK"
                        });
                    }
                    return;
                }
            }

            if (photoURL) {
                if (role === "citizen" || role === "admin") {
                    const updatePhoto = await usersCollection.updateOne({ email: email }, {
                        $set: {
                            photoURL: photoURL
                        }
                    });

                    if (updatePhoto.modifiedCount) {
                        res.send({
                            acknowledge: true,
                            message: "photo updated",
                            statusText: "OK"
                        })
                    }
                    return;
                }

                if (role === "staff") {
                    const updateStaffPhoto = await staffCollection.updateOne({ email: email }, {
                        $set: {
                            photoURL: photoURL
                        }
                    });

                    const updateUserPhoto = await usersCollection.updateOne({ email: email }, {
                        $set: {
                            photoURL: photoURL
                        }
                    });

                    if (updateStaffPhoto.modifiedCount && updateUserPhoto.modifiedCount) {
                        res.send({
                            acknowledge: true,
                            message: "staff and user document updated",
                            statusText: "OK"
                        });
                    }
                    return;
                }
            }
        })

        //get one user --for profile info
        app.get("/users/:uid",verifyToken, async (req, res) => {
            const { uid } = req.params;

            const thisUser = await usersCollection.findOne({ uid: uid });
            res.send(thisUser);
        })

        //block/unblock a user
        app.patch('/admin/toggle-block-user/:email',verifyToken, verifyAdmin, async (req, res) => {
            const { email } = req.params;

            const thisUser = await usersCollection.findOne({ email });

            let result;

            if (thisUser.block) {
                result = await usersCollection.updateOne({ email: email }, {
                    $set: {
                        block: false
                    }
                })
            }
            else {
                result = await usersCollection.updateOne({ email: email }, {
                    $set: {
                        block: true
                    }
                })
            }

            res.send(result);
        })

        //payment apis -- boost issue payment
        app.post('/create-checkout-session',verifyToken, async (req, res) => {
            try {
                const paymentInfo = req.body;
                const amount = Number(paymentInfo.boostFee) * 100;

                const session = await stripe.checkout.sessions.create({
                    line_items: [
                        {
                            price_data: {
                                currency: 'USD',
                                unit_amount: amount,
                                product_data: {
                                    name: paymentInfo.issueTitle
                                },
                            },
                            quantity: 1
                        }
                    ],
                    customer_email: paymentInfo.reporterEmail,
                    mode: 'payment',
                    metadata: {
                        issueId: paymentInfo.issueId,
                        issueTitle: paymentInfo.issueTitle,
                        trackingId: paymentInfo.trackingId,
                        reporterEmail: paymentInfo.reporterEmail
                    },
                    success_url: `${process.env.SITE_DOMAIN}/dashboard/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${process.env.SITE_DOMAIN}/dashboard/payment-cancelled`,
                })

                res.send({
                    url: session.url
                })
            }
            catch (err) {
                return res.send({ error: err.message });
            }
        })

        //after payment success, update priority level of the issue and post payment info into db
        app.patch('/payment-success', async (req, res) => {
            try {
                const sessionId = req.query.session_id;
                const session = await stripe.checkout.sessions.retrieve(sessionId);

                // console.log("Payment session:", session);

                const transactionId = session.payment_intent;

                const paymentExist = await paymentCollection.findOne({ transactionId });

                if (paymentExist) {
                    return res.send({
                        message: "Payment already exists",
                        transactionId,
                        issueTitle: paymentExist.issueTitle
                    });
                }

                if (session.payment_status === 'paid') {
                    const issueId = session.metadata.issueId;
                    const paymentDate = new Date();
                    const trackingId = session.metadata.trackingId;
                    const reporter = session.metadata.reporterEmail.split('@')[0];

                    logTracking(trackingId, issueId, "Issue Boosted for High Priority", reporter); //another tracking log - after boost payment

                    const updatedPriority = await issueCollection.updateOne(
                        { _id: new ObjectId(issueId) },
                        {
                            $set: {
                                priority: "High",
                                priorityLevel: 1,
                                boosted_at: paymentDate
                            }
                        }
                    );


                    //payment info to store to db
                    const payment = {
                        issueTitle: session.metadata.issueTitle,
                        issueId: session.metadata.issueId,
                        transactionId,
                        paid_at: paymentDate,
                        paymentPurpose: "Boost Issue",
                        reporterEmail: session.metadata.reporterEmail,
                        amount: session.amount_total / 100,
                        currency: session.currency
                    }

                    let postPayment;

                    try {
                        postPayment = await paymentCollection.insertOne(payment);
                    }
                    catch (err) {
                        console.log("Payment info post error: ", err);
                        return res.send({
                            message: "Payment info post error",
                            error: err.message
                        });
                    }

                    return res.send({
                        success: true,
                        updatedPriority: updatedPriority,
                        postPayment: postPayment,
                        transactionId: transactionId,
                        issueTitle: session.metadata.issueTitle
                    })

                }
                else {
                    return res.send({ message: "Payment not completed" });
                }
            }
            catch (error) {
                console.log("payment-success error: ", error);
                return res.status(500).send({ message: "Internal Server Error" });
            }
        })


        //payment api-payment for premium subsription
        app.post('/subscribe/create-checkout-session',verifyToken,async (req,res)=>{
            try{
                const paymentInfo = req.body;
                const amount = 1000 * 100;
                
                const session = await stripe.checkout.sessions.create({
                    line_items : [
                        {
                            price_data : {
                                unit_amount : amount,
                                currency : 'USD',
                                product_data : {
                                    name : "Premium Subscription - CityFix"
                                }
                            },
                            quantity : 1
                        }
                    ],
                    customer_email : paymentInfo.userEmail,
                    mode : 'payment',
                    metadata : {
                        userEmail : paymentInfo.userEmail,
                    },
                    success_url: `${process.env.SITE_DOMAIN}/subscription/payment-success?session_id={CHECKOUT_SESSION_ID}`,
                    cancel_url: `${process.env.SITE_DOMAIN}/subscription/payment-cancelled`,
                })

                res.send({
                    url : session.url
                })
            }
            catch(err){
                return res.send({message : err.message})
            }
        })


        //after successfull payment for subscription- update user to Premium
        app.patch('/subscription/payment-success',async (req,res)=>{
            try{
                const sessionId = req.query.session_id;
                const session = await stripe.checkout.sessions.retrieve(sessionId);

                // console.log("Payment session:", session);

                const transactionId = session.payment_intent;

                const paymentExist = await subscriptionPayments.findOne({ transactionId });

                if (paymentExist) {
                    return res.send({
                        message: "Payment already exists",
                        transactionId,
                    });
                }

                if (session.payment_status === 'paid') {
                    const userEmail = session.metadata.userEmail;
                    const paymentDate = new Date();

                    const result = await usersCollection.updateOne(
                        { email: userEmail },
                        {
                            $set: {
                                isPremium: "yes",
                                subscribed_at: paymentDate
                            }
                        }
                    );

                    //payment info to store to db
                    const payment = {
                        transactionId,
                        paid_at: paymentDate,
                        paymentPurpose: "Subscription",
                        userEmail: session.metadata.userEmail,
                        amount: session.amount_total / 100,
                        currency: session.currency
                    }

                    let postPayment;

                    try {
                        postPayment = await subscriptionPayments.insertOne(payment);
                    }
                    catch (err) {
                        console.log("Payment info post error: ", err);
                        return res.send({
                            message: "Payment info post error",
                            error: err.message
                        });
                    }

                    return res.send({
                        success: true,
                        updatedUser: result,
                        postPayment: postPayment,
                        transactionId: transactionId,
                    })
                }
                else {
                    return res.send({ message: "Payment not completed" });
                }
            }
            catch (error) {
                console.log("payment-success error: ", error);
                return res.status(500).send({ message: "Internal Server Error" });
            }
        })

        //get all payments - by admin
        app.get("/admin/all-payments",verifyToken, verifyAdmin, async (req, res) => {
            const allPayments = await paymentCollection.find().sort({paid_at:-1}).toArray();
            res.send(allPayments)
        })
        //get all subscription payments - by admin
        app.get('/admin/subscription-payments',verifyToken, verifyAdmin,async (req,res)=>{
            const payments = await subscriptionPayments.find().sort({paid_at: -1}).toArray();
            res.send(payments);
        })

        //get all payments of a citizen - by citizen/user
        app.get('/citizen/payment-history/:email',verifyToken, async (req, res) => {
            const { email } = req.params;
            const {recent} = req.query;

            const myPayments = paymentCollection.find({ reporterEmail: email }).sort({paid_at : -1});

            const limit = Number(recent);

            if(limit){
                myPayments.limit(limit);
            }

            const result = await myPayments.toArray();

            res.send(result);
        })

        //get subscription payment - by citizen
        app.get('/citizen/subscription-payment/:email',verifyToken,async(req,res)=>{
            const {email} = req.params;

            const payment = await subscriptionPayments.findOne({userEmail:email});
            res.send(payment);
        })

        //get all latest resolved issues
        app.get('/latest-resolved', async (req, res) => {
            const latestResolved = await resolvedCollection.aggregate([
                { $sort: { resolved_at: -1 } },
                { $limit: 6 },
                {
                    $lookup: {
                        from: 'issues',
                        localField: 'issueId',
                        foreignField: "_id",
                        as: 'resolved_issue'
                    }
                },
                { $unwind: "$resolved_issue" }
            ]).toArray();

            res.send(latestResolved);
        })

        //dashboard home page apis --admin
        //count total issue
        app.get('/issue-count', verifyToken,async (req, res) => {
            const issueCount = await issueCollection.countDocuments();
            res.send(issueCount);
        })

        //count registered citizens
        app.get('/citizen-count',verifyToken, async (req, res) => {
            const citizenCount = await usersCollection.countDocuments({ role: 'citizen' });
            res.send(citizenCount);
        })

        //count staff
        app.get('/staff-count',verifyToken, async (req, res) => {
            const staffCount = await staffCollection.countDocuments();
            res.send(staffCount);
        })

        //total revenue
        app.get('/total-revenue',verifyToken, verifyAdmin, async (req, res) => {
            const boostIssueRevenue = await paymentCollection.aggregate([
                {
                    $group: {
                        _id: null,
                        totalBoost: { $sum: { $toInt: "$amount" } }
                    }
                }
            ]).toArray();

            const subscriptionRevenue = await subscriptionPayments.aggregate([
                {
                    $group : {
                        _id : null,
                        totalSubscription : {$sum : {$toInt : "$amount"}}
                    }
                }
            ]).toArray();

            const revenue = (boostIssueRevenue[0]?.totalBoost) + (subscriptionRevenue[0]?.totalSubscription) || 0;
            res.send(revenue);
        })

        //group issues by status
        app.get('/group-issues-by-status',verifyToken, async (req, res) => {
            const {email} = req.query;

            const matchedStaff = email ? {staffEmail:email} : {};

            const result = await issueCollection.aggregate([
                {$match : matchedStaff},
                {
                    $group: {
                        _id: "$status",
                        count: { $sum: 1 }
                    }
                }
            ]).toArray();

            res.send(result);
        })

        //group issues by month
        app.get('/group-issue-by-months',verifyToken, async (req, res) => {
            const result = await issueCollection.aggregate([
                {
                    $addFields: {
                        created_at: { $toDate: "$created_at" }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$created_at" },
                            month: { $month: "$created_at" }
                        },
                        count: { $sum: 1 }
                    }
                }
            ]).toArray();

            res.send(result);
        })


        //dashboard home page apis - Citizens
        //group issues by status and get total count of reported issues
        app.get('/citizen/issue-count-by-status/:email',verifyToken, async (req, res) => {
            const { email } = req.params;

            const result = await issueCollection.aggregate([
                { $match: { reporterEmail: email } },
                {
                    $facet: {
                        byStatus: [
                            {
                                $group: {
                                    _id: "$status",
                                    count: { $sum: 1 }
                                }
                            }

                        ],
                        total : [
                            {
                                $group : {
                                    _id : null,
                                    totalCount : {$sum : 1}
                                }
                            }
                        ]
                    },

                },
            ]).toArray();

            res.send(result);
        })


        // Send a ping to confirm a successful connection
        /* await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!"); */
    } finally {

    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`CityFix server is running on port -> localhost:${port}`);
})