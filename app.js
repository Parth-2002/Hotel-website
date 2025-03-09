const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listings = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname, "/public")));


app.get ("/", (req, res) => {
    res.send("Hi, I'm Root");
});

//Index route
app.get("/listings", wrapAsync( async (req, res) => {
    const allListings = await Listings.find({});
    res.render("listings/index.ejs", {allListings});
}));

//New Route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//Show route
app.get("/listings/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listings.findById(id);
    res.render("listings/show.ejs", {listing});
}));

//Create Route
app.post("/listings", wrapAsync( async (req, res, next) => {
    if(!req.body.listing) {
        throw new ExpressError(400, "Send Valid data for listing");
    }
    let listingData = req.body.listing;
    const newListing = new Listings(listingData);
    await newListing.save();
    res.redirect("/listings");
}));

//Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req, res) => {
    let {id} = req.params;
    const listing = await Listings.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

//Update Route
app.put("/listings/:id", wrapAsync( async (req, res) => {
    if(!req.body.listing) {
        throw new ExpressError(400, "Send Valid data for listing");
    }
    let {id} = req.params;
    await Listings.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//Delete Route
app.delete("/listing/:id", wrapAsync(async(req, res) => {
    let {id} = req.params;
    await Listings.findByIdAndDelete(id);
    res.redirect("/listings");
}));


// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listings({
//         title: "my New Villa",
//         description: "By the Beach",
//         price: 1500,
//         location: "Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful testing");
// });

app.all("/*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {err});
    // res.send("Something went wrong");
});

app.listen(8080, () => {
    console.log("Server is listening");
});