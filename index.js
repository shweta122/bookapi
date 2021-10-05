// Import required modules
const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config()

// API's
const Book = require("./API/book");
const Author = require("./API/author");
const Publication = require("./API/publication");

// Connecting Mongoose
mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }
).then(() => console.log("connection extablished!"))
 .catch((error) => console.log(error));

// Initialization
const OurApp = express();
OurApp.use(express.json())

// Microservices
OurApp.use("/book", Book);
OurApp.use("/author", Author);
OurApp.use("/publication", Publication);

// Main page
OurApp.get("/", (request, response) => {
    return response.json({ message: "Server is working!!!"})
});

// Hosting
OurApp.listen(5000, () => console.log("Server is running"));