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

        app.post("/test",async (req,res)=>{
            const user = req.body;
            console.log("user",user);

            const result = await usersCollection.insertOne(user);

            console.log("result", result);
            
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