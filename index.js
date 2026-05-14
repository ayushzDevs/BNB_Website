const express = require('express');
const app = express();
const port = 8080;

const path = require('path');
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));



const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const { data: sampleListings } = require('./init/data.js');



// middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));


const MONGO_URL = "mongodb://127.0.0.1:27017/BNB_Website"

main().then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB:", err);
});


async function main(){
    await mongoose.connect(MONGO_URL);
    await seedDB();
}

async function seedDB(){
    await Listing.deleteMany({});
    const listingsWithUrl = sampleListings.map(listing => ({
        ...listing,
        image: listing.image.url
    }));
    await Listing.insertMany(listingsWithUrl);
    console.log("Database seeded with sample listings");
}




app.get("/",(req,res)=>{
    res.send("I am root")     
})

app.get("/listings", async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings})


});


// show route
app.get("/listings/:id",async(req,res)=>{
    const {id} = req.params;
    const listings = await Listing.findById(id);
    res.render("listings/show.ejs",{listings})
})







// app.get("/testListening", async (req,res)=>{
//     let sampleListing = new Listing({
//         title : "My New Villa",
//         description : "This is a beautiful villa located in the heart of the city.",
//         price : 1250,
//         location : "landour , Uttarakhand",
//         country : "India",
        
//     })
//     await sampleListing.save()
//     console.log("Sample listing saved to the database");
//     res.send("Sample listing created and saved to the database")
// })

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

