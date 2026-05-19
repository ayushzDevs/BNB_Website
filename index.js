const express = require('express');
const app = express();
const port = 8080;

const errors = require('./express_err.js');


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

app.get("/listings", async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings})


});

// create route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})

// show route
app.get("/listings/:id",async(req,res)=>{
    const {id} = req.params;
    const listings = await Listing.findById(id);
    res.render("listings/show.ejs",{listings})
})




app.post("/listings",async(req,res)=>{
    const {title, description, price, location, country} = req.body;
    const newListing = new Listing({
        title,
        description,
        price,
        location,
        country
    })
    await newListing.save();
    res.redirect("/listings")
});



// update route
app.get("/listings/:id/edit", async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
})

app.put("/listings/:id", async(req,res)=>{
    const {id} = req.params;
    const {title, description, price, location, country} = req.body;
    await Listing.findByIdAndUpdate(id,{title, description, price, location, country});
    res.redirect("/listings")
})



// delete route
app.delete("/listings/:id",async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
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

const handlevalidationError = (err) => {
    console.log("Validation error:", err.message);
    const errorMessages = Object.values(err.errors).map(e => e.message);
    return new errors(400, errorMessages.join(", "));
}

app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name== "ValidationError"){
        const error = handlevalidationError(err);
        res.status(error.status).send(error.messages);
    }

    next(err);

})


app.use((req,res)=>{
    const error = new errors(404, "Page not found");
    res.status(error.status).send(error.messages);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

