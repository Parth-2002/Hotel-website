const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listings = require("./models/listing.js");


async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

main().then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

app.get ("/", (req, res) => {
    res.send("Hi, I'm Root");
});

app.get("/testListing", async (req, res) => {
    let sampleListing = new Listings({
        title: "my New Villa",
        description: "By the Beach",
        price: 1500,
        location: "Goa",
        country: "India",
    });

    await sampleListing.save();
    console.log("Sample was saved");
    res.send("Successful testing");
});

app.listen(8080, () => {
    console.log("Server is listening");
});