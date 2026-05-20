const express = require('express');
const app = express();
const port = 8080;

const errors = require('./utils/express_err.js');
const handlevalidationError = (err) => {
    console.log("Validation error:", err.message);
    const errorMessages = Object.values(err.errors).map(e => e.message);
    return new errors(400, errorMessages.join(", "));
}


const path = require('path');
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));


const ejsmate = require('ejs-mate');
app.engine('ejs', ejsmate);


app.use(express.static(path.join(__dirname,"views/public")));

const methodoverride = require('method-override');
app.use(methodoverride('_method'));


// middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));


const wrapAsync = require('./utils/wrapAsync.js');



const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const { data: sampleListings } = require('./init/data.js');


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

app.get("/listings", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings})


}));

// create route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

// show route
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listings = await Listing.findById(id);
    res.render("listings/show.ejs",{listings})
}));




app.post("/listings",wrapAsync(async(req,res)=>{
    if(!req.body.imageUrl){
        req.body.imageUrl = "https://source.unsplash.com/collection/483251/800x600";
    }
    if(!req.body.listing){
        throw new errors(400, "Invalid listing data , send valid data for listing");
    }
    const {title, description, price, location, country, imageUrl} = req.body;
    const newListing = new Listing({ title, description, price, location, country, image: imageUrl });
    await newListing.save();
    res.redirect("/listings")
}));



// update route
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
}));

app.put("/listings/:id", wrapAsync(async(req,res)=>{
    if(!req.body.listing){
        throw new errors(400, "Invalid listing data , send valid data for listing");
    }
    const {id} = req.params;
    const {title, description, price, location, country} = req.body;
    await Listing.findByIdAndUpdate(id,{title, description, price, location, country});
    res.redirect("/listings")
}));



// delete route
app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
}));

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



app.use((err, req, res, next) => {
    if (err.name === "ValidationError") {
        const error = handlevalidationError(err);
        return res.status(error.status).send(error.messages);
    }
    next(err);
});

app.use((req, res, next) => {
    next(new errors(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const { status = 500, messages, message = "Internal Server Error" } = err; 
    res.render("error.ejs",{err})
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

