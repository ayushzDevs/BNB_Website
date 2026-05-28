const errors = require("./express_err.js");
const Listing = require("../models/listing.js");

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "Please log in to continue.");
    return res.redirect("/login");
  }
  next();
};

const isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new errors(404, "Listing Not Found");
  }
  if (!listing.owner || !listing.owner.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that.");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
const isOwnerOrAdmin = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    throw new errors(404, "Listing Not Found");
  }
  const isAdmin = req.user && req.user.role === "admin";
  if (isAdmin || (listing.owner && listing.owner.equals(req.user._id))) {
    return next();
  }
  req.flash("error", "You do not have permission to do that.");
  return res.redirect(`/listings/${id}`);
};

module.exports = { isLoggedIn, isOwner, isOwnerOrAdmin };
