const express = require('express');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 3000;
const uri = `${process.env.URI}`;

app.use(express.json());
app.use(cors());

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

        //post an issue
        app.post("/issues",async (req,res)=>{
            const newIssue = req.body;
            const afterPost = await issueCollection.insertOne(newIssue);
            res.send(afterPost);
        })

        //my issues - issues reported by a citizen
        app.get("/issues/:email",async (req,res)=>{
            const {email} = req.params;
            const issues = await issueCollection.find({reporterEmail:email}).toArray();
            res.send(issues);
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