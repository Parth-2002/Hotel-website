const express = require("express");
const Listings = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const router = express.Router();
const {isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listins.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });



//Index, Create route
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(
        isLoggedIn,
        upload.single('listing[image]'),
        validateListing, 
        wrapAsync(listingController.createListing)
    );

//New Route
router.get("/new", isLoggedIn , listingController.renderNewForm);

// Show, Update, Delete route
router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put( 
        isLoggedIn, 
        isOwner, 
        upload.single("listing[image][url]"),
        validateListing,
        wrapAsync(listingController.updateListing)
    )
    .delete(
        isLoggedIn, 
        isOwner, 
        wrapAsync(listingController.deleteListing)
    );


//Edit Route
router.get(
    "/:id/edit", 
    isLoggedIn, 
    isOwner, 
    wrapAsync(listingController.renderEditForm)
);

module.exports = router;