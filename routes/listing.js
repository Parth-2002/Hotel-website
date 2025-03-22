const express = require("express");
const Listings = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const router = express.Router();

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//Index route
router.get("/", wrapAsync( async (req, res) => {
    const allListings = await Listings.find({});
    res.render("listings/index.ejs", {allListings});
}));

//New Route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Show route
router.get("/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listings.findById(id).populate("reviews");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

//Create Route
router.post("/", validateListing, wrapAsync( async (req, res, next) => {
    
    let listingData = req.body.listing;
    const newListing = new Listings(listingData);
    await newListing.save();
    req.flash("success", "Successfully created a new listing");
    res.redirect("/listings");
}));

//Edit Route
router.get("/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listings.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

//Update Route
router.put("/:id", validateListing, wrapAsync( async (req, res) => {
    if(!req.body.listing) {
        throw new ExpressError(400, "Send Valid data for listing");
    }
    let {id} = req.params;
    await Listings.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
router.delete("/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    await Listings.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing");
    res.redirect("/listings");
}));

module.exports = router;