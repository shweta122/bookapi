const mongoose = require("mongoose");

// Create book schema
const BookSchema = mongoose.Schema({
    ISBN: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    authors: [Number],
    language: String,
    pubDate: String,
    numOfPage: Number,
    category: [String],
    publication: Number,
});

// Create a book model
const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;