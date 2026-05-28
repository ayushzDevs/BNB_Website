const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwnerOrAdmin } = require("../utils/auth.js");
const { validateListing, validateReview } = require("../middleware/validate.js");
const listingController = require("../controllers/listings.js");



router.get("/", wrapAsync(listingController.index));

// create route
router.get("/new", isLoggedIn, listingController.renderNew);

// show route
router.get("/:id", wrapAsync(listingController.showListing));




router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

// reviews
router.post("/:id/reviews", validateReview, wrapAsync(listingController.createReview));

router.delete("/:id/reviews/:reviewId", wrapAsync(listingController.deleteReview));



// update route
router.get("/:id/edit", isLoggedIn, isOwnerOrAdmin, wrapAsync(listingController.renderEdit));

router.put("/:id", isLoggedIn, isOwnerOrAdmin, validateListing, wrapAsync(listingController.updateListing));



// delete route
router.delete("/:id", isLoggedIn, isOwnerOrAdmin, wrapAsync(listingController.deleteListing));

module.exports = router;