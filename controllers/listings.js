const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const errors = require("../utils/express_err.js");

const index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

const renderNew = (req, res) => {
  res.render("listings/new.ejs");
};

const showListing = async (req, res) => {
  const { id } = req.params;
  const listings = await Listing.findById(id).populate("reviews");
  if (!listings) {
    throw new errors(404, "Listing Not Found");
  }
  res.render("listings/show.ejs", { listings });
};

const createListing = async (req, res) => {
  const payload = req.body.listing || req.body.newListing || req.body;
  if (!payload) {
    throw new errors(400, "Invalid listing data , send valid data for listing");
  }
  const { title, description, price, location, country, imageUrl } = payload;
  const image = imageUrl || "https://source.unsplash.com/collection/483251/800x600";
  const newListing = new Listing({
    title,
    description,
    price,
    location,
    country,
    image,
    owner: req.user._id
  });

  await newListing.save();
  req.flash("success", "New listing created");
  res.redirect("/listings");
};

const renderEdit = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new errors(404, "Listing Not Found");
  }
  res.render("listings/edit.ejs", { listing });
};

const updateListing = async (req, res) => {
  const { id } = req.params;
  const payload = req.body.listing || req.body;
  const { title, description, price, location, country } = payload;
  await Listing.findByIdAndUpdate(id, { title, description, price, location, country });
  req.flash("success", "Listing updated");
  res.redirect("/listings");
};

const deleteListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted");
  res.redirect("/listings");
};

const createReview = async (req, res) => {
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
  req.flash("success", "Review added");
  res.redirect(`/listings/${id}`);
};

const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted");
  res.redirect(`/listings/${id}`);
};

module.exports = {
  index,
  renderNew,
  showListing,
  createListing,
  renderEdit,
  updateListing,
  deleteListing,
  createReview,
  deleteReview
};
