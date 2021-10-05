const Router = require("express").Router();
const AuthorModel = require("../schema/author");


/* ------------------------ GET APIs -------------------------- */


// Route    - /author
// Des      - to get all authors
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none

Router.get("/", async (request, response) => {
    const getAllAuthors = await AuthorModel.find();
    return response.json(getAllAuthors);
});

// Route    - /author/aut/:author_
// Des      - to get specific author
// Access   - Public
// Method   - GET
// Params   - author
// Body     - none

Router.get("/aut/:author_", async (request, response) => {
    const getSpecificAuthor = await AuthorModel.findOne({id: parseInt(request.params.author_)});

    if (!getSpecificAuthor) {
        return response.json({
            error: `No author found for the id of ${parseInt(request.params.author_)}`
    });
    }

    return response.json(getSpecificAuthor);
});

// Route    - /author/book/:book
// Des      - to get list of author based on a book
// Access   - Public
// Method   - GET
// Params   - author
// Body     - none

Router.get("/book/:book", async (request, response) => {
    const getSpecificAuthor = await AuthorModel.findOne({books: request.params.book});

    if (!getSpecificAuthor) {
        return response.json({
            error: `No author found for the book ${request.params.book}`
    });
    }

    return response.json(getSpecificAuthor);
});


/* ------------------------ POST APIs -------------------------- */

// Route    - /author/new
// Des      - to add new author
// Access   - Public
// Method   - POST
// Params   - none
// Body     - { newAuthor: { details } }

Router.post("/new", (request, response) => {
    try {
        const { newAuthor } = request.body;

        AuthorModel.create(newAuthor);
        return response.json({ message: "Author added to the database" });
    }
    catch(error) {
        return response.json({ error: error.message });
    }
});


/* ------------------------ PUT APIs -------------------------- */

// Route    - /author/update/:id
// Des      - update author details
// Access   - Public
// Method   - PUT
// Params   - id
// Body     - { "name": { newName } }

Router.put("/update/:id", async (request, response) => {
    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        { id: parseInt(request.params.id) },
        { name: request.body.name },
        { new: true }
    );

    return response.json(updatedAuthor);
});


/* ------------------------ DELETE APIs -------------------------- */

// Route    - /author/delete/:authorID
// Des      - delete an author
// Access   - Public
// Method   - DELETE
// Params   - authorID
// Body     - none

Router.delete("/delete/:authorID", async (request, response) => {
    const updatedAuthor = await AuthorModel.findOneAndDelete( 
        { id: parseInt(request.params.authorID) }
    );

    return response.json({ authros: updatedAuthor });
});

module.exports = Router;