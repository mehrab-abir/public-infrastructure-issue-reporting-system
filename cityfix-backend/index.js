const express = require('express');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
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
const verifyToken = async (req,res,next)=>{
    if(!req.headers.authorization){
        return res.status(401).sned({message : "unauthorized access"});
    }

    const token = req.headers.authorization.split(' ')[1];
    
    if(!token){
        return res.status(401).send({message : "unauthorized access"});
    }

    try{
        const decode = await admin.auth().verifyIdToken(token);
        req.token_email = decode.email;

        next();
    }
    catch{
        return res.status(401).send({ message: "unauthorized access" });
    }
}

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

app.get('/',(req,res)=>{
    res.send("CityFix server is running");
})

async function run() {
    try {
        await client.connect();

        const db = client.db("cityfix-db");
        const usersCollection = db.collection("users");
        const issueCollection = db.collection("issues");

        //middleware to verify role - admin
        const verifyAdmin = async (req,res,next)=>{
            const email = req.token_email;
            const user = await usersCollection.findOne({email});

            if(!user || user.role != "admin"){
                return res.status(403).send({message : "forbidden access"});
            }
            next();
        }

        // apis for users/citizens 
        //post an issue
        app.post("/issues",async (req,res)=>{
            const newIssue = req.body;
            const afterPost = await issueCollection.insertOne(newIssue);
            res.send(afterPost);
        })

        //get all my issues - issues reported by a citizen
        app.get("/issues/:email",async (req,res)=>{
            const {email} = req.params;
            const issues = await issueCollection.find({reporterEmail:email}).toArray();
            res.send(issues);
        })


        //apis for admin
        //get all users
        app.get("/users",async (req,res)=>{
            const users = await usersCollection.find().toArray();
            res.send(users);
        })

        //get all issues
        app.get("/all-issues",verifyToken,verifyAdmin,async (req,res)=>{
            const issues = await issueCollection.find().toArray();
            res.send(issues);
        })

        //get one user's role
        app.get("/user/:email/role",async (req,res)=>{
            const {email} = req.params;
            const userRole = await usersCollection.findOne({email :email},{
                projection : {
                    role : 1
                }
            });
            res.send({role : userRole?.role});
        })


        //post user to db
        app.post("/users",async (req,res)=>{
            const newUser = req.body;

            const userExists = await usersCollection.findOne({email:newUser.email});

            if(userExists){
                return res.send({userExists : "user already exists, not posted"});
            }

            const result = await usersCollection.insertOne(newUser);

            res.send(result);
        })

        //update user profile -displayName or photURL
        app.patch("/update-profile/:email",async (req,res)=>{
            const {displayName, photoURL} = req.body;
            const {email} = req.params;

            if(displayName){
                const updateName = await usersCollection.updateOne({email : email},{
                    $set : {
                        displayName : displayName
                    }
                });
                res.send(updateName);
                return;
            }

            if(photoURL){
                const updatePhoto = await usersCollection.updateOne({email : email},{
                    $set : {
                        photoURL : photoURL
                    }
                });
                res.send(updatePhoto);
                return;
            }
        })
        

        //get one user --for profile info
        app.get("/users/:email",async (req,res)=>{
            const {email} = req.params;
            const thisUser = await usersCollection.findOne({email : email});
            res.send(thisUser);
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        
    }
}
run().catch(console.dir);

app.listen(port,()=>{
    console.log(`CityFix server is running on port -> localhost:${port}`);
})