const mongoose = require("mongoose");

// Create author schema
const AuthorSchema = mongoose.Schema({
    id: {
        type: Number,
        require: true,
    },
    name: String,
    books: [String],
});

// Create a author model
const AuthorModel = mongoose.model("authors", AuthorSchema);

module.exports = AuthorModel;