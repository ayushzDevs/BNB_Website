const express = require('express');
const app = express();
const port = 8080;
const mongoose = require('mongoose');

const MONGO_URL = "mongodb://127.0.0.1:27017/BNB_Website"

main().then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB:", err);
});


async function main(){
    await mongoose.connect(MONGO_URL);
}




app.get("/",(req,res)=>{
    res.send("I am root")
})










app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

