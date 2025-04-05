const express = require("express");
const Listings = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const router = express.Router();
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listins.js");

//Index route
router.get("/", wrapAsync(listingController.index));

//New Route
router.get("/new", isLoggedIn , listingController.renderNewForm);

//Show route
router.get("/:id", wrapAsync(listingController.showListing));

//Create Route
router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//Update Route
router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync( listingController.updateListing));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;