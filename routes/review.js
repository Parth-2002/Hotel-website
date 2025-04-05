const express = require("express");
const Listings = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const router = express.Router({mergeParams: true});
const {isLoggedIn, validateReview, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");

//post Review route
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

// Delete Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;