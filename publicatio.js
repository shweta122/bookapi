const mongoose = require("mongoose");

// Create publication schema
const PublicationSchema = mongoose.Schema({
    id: {
        type: Number,
        require: true,
    },
    name: String,
    books: [String],
});

// Create a publication model
const PublicationModel = mongoose.model("publications", PublicationSchema);

module.exports = PublicationModel;