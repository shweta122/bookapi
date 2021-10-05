const Router = require("express").Router();
const BookModel = require("../schema/book");
const PublicationModel = require("../schema/publication");


/* ------------------------ GET APIs -------------------------- */


// Route    - /publication
// Des      - to get all publication
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none

Router.get("/", async (request, response) => {
    const getAllPublication = await PublicationModel.find();
    return response.json(getAllPublication);
});

// Route    - /publication/pub/:pub_
// Des      - to get specific publication
// Access   - Public
// Method   - GET
// Params   - publication
// Body     - none

Router.get("/pub/:pub_", async (request, response) => {
    const getSpecificPublication = await PublicationModel.findOne({id: parseInt(request.params.pub_)});

    if (!getSpecificPublication) {
        return response.json({
            error: `No publication found for the id of ${parseInt(request.params.pub_)}`
    });
    }

    return response.json(getSpecificPublication);
});

// Route    - /publication/book/:book_
// Des      - to get a list of publication based on a book
// Access   - Public
// Method   - GET
// Params   - book
// Body     - none

Router.get("/book/:book_", async (request, response) => {
    const getSpecificPublication = await PublicationModel.findOne({books: request.params.book_});

    if (!getSpecificPublication) {
        return response.json({
            error: `No publication found for the book ${request.params.book_}`
    });
    }

    return response.json(getSpecificPublication);
});


/* ------------------------ POST APIs -------------------------- */

// Route    - /publication/new
// Des      - to add new publication
// Access   - Public
// Method   - POST
// Params   - none
// Body     - { newPublication: { details } }

Router.post("/new", (request, response) => {
    try {
        const { newPublication } = request.body;

        PublicationModel.create(newPublication);
        return response.json({ message: "Publication added to the database" });
    }
    catch(error) {
        return response.json({ error: error.message });
    }
});


/* ------------------------ PUT APIs -------------------------- */

// Route    - /publication/update/:id
// Des      - update publication
// Access   - Public
// Method   - PUT
// Params   - id
// Body     - { "name": { newName } }

Router.put("/update/:id", async (request, response) => {
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        { id: parseInt(request.params.id) },
        { name: request.body.name },
        { new: true }
    );

    return response.json(updatedPublication);
});

// Route    - /publication/updateBook/:id
// Des      - to update/add new book
// Access   - Public
// Method   - PUT
// Params   - id
// Body     - { "book": ISBN }

Router.put("/updateBook/:id", async (request, response) => {
    const updatedPublication = await PublicationModel.findOneAndUpdate(
        { id: parseInt(request.params.id) },
        { $addToSet: { books: request.body.book } },
        { new: true }
    );
    
    const updatedBook = await BookModel.findOneAndUpdate(
        { ISBN: request.body.book },
        { publication: parseInt(request.params.id) },
        { new: true }
    );

    return response.json({ publication: updatedPublication, book: updatedBook });
});


/* ------------------------ DELETE APIs -------------------------- */

// Route    - /publication/delete/:publicationId
// Des      - delete a publication
// Access   - Public
// Method   - DELETE
// Params   - publicationID
// Body     - none

Router.delete("/delete/:publicationId", async (request, response) => {
    const updatedPublication = await PublicationModel.findOneAndDelete( 
        { id: parseInt(request.params.publicationId) }
    );

    return response.json({ publications: updatedPublication });
});

// Route    - /publication/deleteBook/:publicationId/:bookId
// Des      - delete a book from publication
// Access   - Public
// Method   - DELETE
// Params   - publicationID, bookID
// Body     - none

Router.delete("/deleteBook/:publicationId/:bookId", async (request, response) => {
    const id = parseInt(request.params.publicationId);
    const isbn = request.params.bookId;

    const updatedPublication = await PublicationModel.findOneAndUpdate(
        { id: id },
        { $pull: { books: isbn } },
        { new: true }
    );

    const updatedBook = await BookModel.findOneAndUpdate(
        { ISBN: isbn },
        { publication: -1 },
        { new: true }
    );

    response.json({ publication: updatedPublication, book: updatedBook })
});

module.exports = Router;