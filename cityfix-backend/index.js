const express = require('express');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 3000;
const uri = `${process.env.URI}`;
const admin = require("firebase-admin");

const serviceAccount = require("./cityfix-firebase-service-key.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

app.use(express.json());
app.use(cors());

//middleware, --verify token
const verifyToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(401).sned({ message: "unauthorized access" });
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
        await client.connect();

        const db = client.db("cityfix-db");
        const usersCollection = db.collection("users");
        const issueCollection = db.collection("issues");
        const staffCollection = db.collection("staffs");
        const trackingCollection = db.collection("trackingLogs");

        //middleware to verify role - admin
        const verifyAdmin = async (req, res, next) => {
            const email = req.token_email;
            const user = await usersCollection.findOne({ email });

            if (!user || user.role != "admin") {
                return res.status(403).send({ message: "forbidden access" });
            }
            next();
        }

        //log tracking
        const logTracking = async (trackingId,issueId,issueStatus,updatedBy)=>{
            const log = {
                trackingId,
                issueStatus,
                issueId,
                updatedBy,
                updated_at : new Date()
            }

            const result = await trackingCollection.insertOne(log);
            return result;
        }

        // apis for users/citizens 
        //post an issue
        app.post("/issues", async (req, res) => {
            const newIssue = req.body;
            
            const trackingId = generateTrackingId();

            newIssue.trackingId = trackingId;
            const afterPost = await issueCollection.insertOne(newIssue);

            const issueId = afterPost.insertedId.toString();
            const reporter = newIssue.reporterEmail.split('@')[0];

            logTracking(trackingId,issueId,"Issue Reported", reporter); //1st tracking log

            res.send(afterPost);
        })

        //get all my issues - issues reported by a citizen
        app.get("/issues/:email", async (req, res) => {
            const { email } = req.params;
            const issues = await issueCollection.find({ reporterEmail: email }).toArray();
            res.send(issues);
        })

        //delete an issue - as citizen
        app.delete('/citizen/delete-issue/:issueId',async(req,res)=>{
            const {issueId} = req.params;
            const deletedIssue = await issueCollection.deleteOne({_id : new ObjectId(issueId)});
            res.send(deletedIssue);
        })

        //get all assigned issue --for staff
        app.get("/staff/assigned-issues/:email",async (req,res)=>{
            const {email} = req.params;

            const myAssignedIssues = await issueCollection.find({staffEmail : email}).sort({created_at: -1}).toArray();

            res.send(myAssignedIssues);
        })
        
        //update issue status by staff - accept/reject, in-progress, working, resolved, closed etc. -- 3rd, 4th, 5th... tracking log here
        app.patch("/staff/update-issue-status",async (req,res)=>{
            const {staffResponse,staffEmail, issueId, trackingId} = req.body;

            let issueStatus = '';

            if(staffResponse === "accept"){
                issueStatus = "In Progress";
            }
            else if (staffResponse === "Working"){
                issueStatus = "Working";
            }
            else if(staffResponse === "Resolved"){
                issueStatus = "Resolved";
            }
            else if(staffResponse === "Closed"){
                issueStatus = "Closed";
            }
            else{
                issueStatus = "Pending";
                staffEmail = '';
            }

            const thisIssue = await issueCollection.updateOne({ _id: new ObjectId(issueId) }, {
                $set: {
                    status: issueStatus,
                    staffEmail : staffEmail
                }
            });

            //logging the tracking info if only the issueStatus updates to next stage, such as "In Progress", "Working", or "Resolved" etc.

            /* if the staff rejects the issue, issue status will go back to "Pending", but it will not be logged into tracking*/
            if(issueStatus !== "Pending"){
                logTracking(trackingId, issueId, issueStatus, "Staff");
                //3rd, 4th, 5th...tracking log
            }

            res.send(thisIssue);
        })


        //apis for admin
        //get all users
        app.get("/users", async (req, res) => {
            const users = await usersCollection.find().toArray();
            res.send(users);
        })

        //get all staffs --for admin
        app.get("/all-staffs",async (req,res)=>{
            const staffs = await staffCollection.find().toArray();
            res.send(staffs);
        })

        //assign a staff to an issue --for admin
        app.patch("/assign-staff",async (req,res)=>{
            const {issueId, trackingId, staffEmail, staffName} = req.body;

            const issueStatus = `Staff Assigned`;

            const issueAssigned = await issueCollection.updateOne({_id : new ObjectId(issueId)},{
                $set : {
                    staffEmail : staffEmail,
                    status: issueStatus
                }
            })

            logTracking(trackingId, issueId, `${issueStatus} - ${staffName}`, "Admin"); //2nd tracking log

            res.send(issueAssigned);
        })

        //get all issues
        app.get("/all-issues", verifyToken, async (req, res) => {
            const issues = await issueCollection.find().toArray();
            res.send(issues);
        })

        //get one issue details
        app.get("/issue/details/:issueId",async (req,res)=>{
            const {issueId} = req.params;
            const thisIssue = await issueCollection.findOne({_id : new ObjectId(issueId)});
            res.send(thisIssue);
        })

        //get timeline of one issue
        app.get('/timeline/:issueId',async (req,res)=>{
            const {issueId} = req.params;
            const timeline = await trackingCollection.find({issueId : issueId}).sort({updated_at : -1}).toArray();
            res.send(timeline);
        })

        //delete an issue - as admin
        app.delete("/admin/delete-issue/:issueId",async (req,res)=>{
            const {issueId} = req.params;
            const deletedIssue = await issueCollection.deleteOne({_id : new ObjectId(issueId)});
            res.send(deletedIssue);
        })

        //get reporter and staff info of an issue
        app.get('/issue-reporter',async(req,res)=>{
            const { reporterEmail, staffEmail } = req.query;

            let reporter = {};
            if(reporterEmail){
                reporter = await usersCollection.findOne({email : reporterEmail});
            }

            let staff = {};
            if(staffEmail){
                staff = await staffCollection.findOne({email : staffEmail});
            }
            
            res.send({
                reporter : reporter || {},
                staff : staff || {}
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
                    acknowledge : true,
                    message: "staff account created",
                    staffEmail: staff.email,
                    uid: staff.uid
                })
            }
            catch (err) {
                res.status(400).send({ message: err.message });
            }
        });

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
        app.patch("/update-profile/:email", async (req, res) => {
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

                    if(updateName.modifiedCount){
                        res.send({
                            acknowledge : true,
                            message : "name updated",
                            statusText : "OK"
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

                    if(updateStaffName.modifiedCount && updateUserName.modifiedCount){
                        res.send({
                            acknowledge : true, 
                            message : "staff and user document updated",
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
                    
                    if(updatePhoto.modifiedCount){
                        res.send({
                            acknowledge: true,
                            message: "photo updated",
                            statusText: "OK"
                        })
                    }
                    return;
                }

                if(role === "staff"){
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
        app.get("/users/:uid", async (req, res) => {
            const { uid } = req.params;

            const thisUser = await usersCollection.findOne({ uid: uid });
            console.log(thisUser);
            res.send(thisUser);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {

    }
}
run().catch(console.dir);

app.listen(port, () => {
    console.log(`CityFix server is running on port -> localhost:${port}`);
})