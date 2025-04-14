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
    // console.log(listing);
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    let Listing = await new Listings(req.body.listing);
    Listing.owner = req.user._id;
    Listing.image = { url, filename };

    await Listing.save();
    req.flash("success", "new listing successfully created");
    res.redirect("/listings");
}

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
    let listing = await Listings.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
    }
    
    req.flash(success, "Listing updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req, res) => {
    let {id} = req.params;
    await Listings.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the listing");
    res.redirect("/listings");
};