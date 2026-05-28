// express app setup
require("dotenv").config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;



const session = require("express-session");
const flash = require("connect-flash");


// authentication requires
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.model.js");



// cookies
const cookieParser = require('cookie-parser');
const cookieSecret = process.env.COOKIE_SECRET || "dev-cookie-secret";
app.use(cookieParser(cookieSecret));

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
    secret : process.env.SESSION_SECRET || "dev-session-secret",
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

//authentication apply
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    res.locals.isAdmin = req.user && req.user.role === "admin";
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




// database setup
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const { data: sampleListings, reviews: sampleReviews } = require('./init/data.js');
const normalizeAdminEmails = (value) =>
    value
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean);


const MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/BNB_Website";

main().then(()=>{
    console.log("Connected to MongoDB");
})
.catch((err)=>{
    console.log("Error connecting to MongoDB:", err);
});


async function main(){
    await mongoose.connect(MONGO_URL);
    await syncAdminUsers();
    await seedDB();
}

async function syncAdminUsers() {
    const adminEmails = normalizeAdminEmails(process.env.ADMIN_EMAILS || "");
    if (!adminEmails.length) {
        return;
    }
    const result = await User.updateMany(
        { email: { $in: adminEmails } },
        { $set: { role: "admin" } }
    );
    const matchedCount = await User.countDocuments({ email: { $in: adminEmails } });
    if (result.modifiedCount) {
        console.log(`Admin roles synced for ${result.modifiedCount} users`);
    }
    if (!matchedCount) {
        console.log("Admin sync: no matching users found for ADMIN_EMAILS");
        return;
    }
    console.log(`Admin sync: ${matchedCount} admin account(s) active`);
}

async function seedDB(){
    const existingListings = await Listing.countDocuments();
    if (existingListings >= sampleListings.length) {
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
    res.redirect("/listings");    
})


app.get("/demouser",async(req,res)=>{

    let fakeUser = new User({
        email:"student1@mail.com",
        username: "stud"
    });
    await User.register(fakeUser,"Ash");
    res.send("Demo user created");
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

const userRoute = require('./routes/user.js');
app.use("/", userRoute);



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

