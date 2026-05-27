// express app setup
const express = require('express');
const app = express();
const port = 8080;



const session = require("express-session");
const flash = require("connect-flash");




// cookies
const cookieParser = require('cookie-parser');
app.use(cookieParser("secretcode"));

app.use((req, res, next) => {
  res.cookie("clientIp", req.ip, {
    signed: true,
    httpOnly: true,
    sameSite: "lax",
    // secure: true, // enable in production with HTTPS
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  next();
});


const sessionOptions = {
    secret : "mysupersecretcode",
    resave: false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 1000*60*60*24*3,
        maxAge : 1000*60*60*24*3,
        httpOnly: true
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    return next()
})


app.get("/verify",(req,res)=>{
    const signedcookies = req.signedCookies;
    console.log("Signed Cookies:", signedcookies);
    if(signedcookies.clientIp=== req.ip){
        res.send("Cookie is valid!");
    }
    else{
        res.send("Cookie is invalid or has been tampered with.");
    }
})


// error handling
const errors = require('./utils/express_err.js');
const handlevalidationError = (err) => {
    console.log("Validation error:", err.message);
    const errorMessages = Object.values(err.errors).map(e => e.message);
    return new errors(400, "Validation failed", errorMessages);
}






// schema validation
const { listingschema, reviewSchema } = require('./schema.js');

// view engine setup
const path = require('path');
app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));

// ejs mate setup
const ejsmate = require('ejs-mate');
app.engine('ejs', ejsmate);

// static files setup
app.use(express.static(path.join(__dirname,"views/public")));

// method override setup
const methodoverride = require('method-override');
app.use(methodoverride('_method'));


// middlewares
app.use(express.json());
app.use(express.urlencoded({extended : true}));


// async wrapper for error handling in async functions
const wrapAsync = require('./utils/wrapAsync.js');


// database setup
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const { data: sampleListings, reviews: sampleReviews } = require('./init/data.js');


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
    const existingListings = await Listing.countDocuments();
    if (existingListings > 0) {
        console.log("Seed skipped: listings already exist");
        return;
    }
    await Listing.deleteMany({});
    await Review.deleteMany({});
    const listingsWithUrl = sampleListings.map(listing => ({
        ...listing,
        image: listing.image.url
    }));
    for (let i = 0; i < listingsWithUrl.length; i++) {
        const listing = new Listing(listingsWithUrl[i]);
        const first = sampleReviews[i % sampleReviews.length];
        const second = sampleReviews[(i + 1) % sampleReviews.length];
        const reviewDocs = await Review.insertMany([first, second]);
        listing.reviews.push(...reviewDocs.map(r => r._id));
        await listing.save();
    }
    console.log("Database seeded with sample listings and reviews");
}



// routes
app.get("/",(req,res)=>{
    res.send("I am root")     
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

const listingRoute = require('./routes/listing.js');
app.use("/listings", listingRoute);



app.use((err, req, res, next) => {
    if (err.name === "ValidationError") {
        const error = handlevalidationError(err);
        return res.status(error.status).send(error.messages || error.message);
    }
    next(err);
});

app.use((req, res, next) => {
    next(new errors(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    const { status = 500, messages, message = "Internal Server Error" } = err; 
    res.status(status);
    res.render("error.ejs", { err: { status, message, messages } });
});




app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

