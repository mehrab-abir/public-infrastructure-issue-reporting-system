const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send("CityFix server is running");
})

app.listen(port,()=>{
    console.log(`CityFix server is running on port -> localhost:${port}`);
})