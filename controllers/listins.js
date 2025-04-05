const Listings = require("../models/listing");

module.exports.index =  async (req, res) => {
    const allListings = await Listings.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req, res) => {
    let {id} = req.params;
    const listing = await Listings.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res, next) => {
    let listingData = req.body.listing;
    const newListing = new Listings(listingData);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "Successfully created a new listing");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listings.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
};

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    await Listings.findByIdAndUpdate(id, {...req.body.listing});
    req.flash(success, "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req, res) => {
    let {id} = req.params;
    await Listings.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing");
    res.redirect("/listings");
};