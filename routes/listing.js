const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { listingschema, reviewSchema } = require('../schema.js');
const errors = require('../utils/express_err.js');

const validatelisting = (req,res,next)=>{
    let {error: listingValidation} = listingschema.validate(req.body);
    console.log("Validation result:", listingValidation);
    if(listingValidation){
        let ermsg = listingValidation.details.map(d => d.message);
        console.log("Validation errors:", ermsg);
        throw new errors(400, "Invalid listing data", listingValidation.details.map(d => d.message));
    }
    else{
        next();
    }
}



const validateReview = (req, res, next) => {
    const { error: reviewValidation } = reviewSchema.validate(req.body);
    if (reviewValidation) {
        throw new errors(400, "Invalid review data", reviewValidation.details.map(d => d.message));
    }
    next();
}



router.get("/", wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings})


}));

// create route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs")
})

// show route
router.get("/:id",wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listings = await Listing.findById(id).populate("reviews");
    if (!listings) {
        throw new errors(404, "Listing Not Found");
    }
    res.render("listings/show.ejs",{listings})
}));




router.post("/",validatelisting,wrapAsync(async(req,res)=>{
    const payload = req.body.listing || req.body.newListing || req.body;
    if(!payload){
        throw new errors(400, "Invalid listing data , send valid data for listing");
    }
    const { title, description, price, location, country, imageUrl } = payload;
    const image = imageUrl || "https://source.unsplash.com/collection/483251/800x600";
    const newListing = new Listing({ title, description, price, location, country, image });

    
    await newListing.save();
    req.flash("success", "new listing created")
    res.redirect("/listings")
}));

// reviews
router.post("/:id/reviews", validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        throw new errors(404, "Listing Not Found");
    }
    const { rating, comment } = req.body.review;
    const review = new Review({ rating, comment });
    await review.save();
    listing.reviews.push(review);
    await listing.save();
    res.redirect(`/listings/${id}`);
}));

router.delete("/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));



// update route
router.get("/:id/edit",  wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing})
}));

router.put("/:id", validatelisting, wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const payload = req.body.listing || req.body;
    const {title, description, price, location, country} = payload;
    await Listing.findByIdAndUpdate(id,{title, description, price, location, country});
    res.redirect("/listings")
}));



// delete route
router.delete("/:id",wrapAsync(async(req,res)=>{
    const {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
}));

module.exports = router;