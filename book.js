const Router = require("express").Router();
const BookModel = require("../schema/book");
const AuthorModel = require("../schema/author");


/* ------------------------ GET APIs -------------------------- */

// Route    - /book
// Des      - to get all books
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none

Router.get("/", async (request, response) => {
    const getAllBooks = await BookModel.find();
    return response.json(getAllBooks);
});

// Route    - /book/:BookID
// Des      - to get specific book
// Access   - Public
// Method   - GET
// Params   - bookID
// Body     - none

Router.get("/:bookID", async (request, response) => {
    const getSpecificBook = await BookModel.findOne({ISBN: request.params.bookID});

    if (!getSpecificBook) {
        return response.json({
            error: `No book found for the ISBN of ${request.params.bookID}`
    });
    }

    return response.json(getSpecificBook);
});

// Route    - /book/cat/:category
// Des      - to get a list of books based on category
// Access   - Public
// Method   - GET
// Params   - category
// Body     - none

Router.get("/cat/:category", async (request, response) => {
    const getSpecificBook = await BookModel.findOne({category: request.params.category});

    if (!getSpecificBook) {
        return response.json({
            error: `No book found for the category of ${request.params.category}`
    });
    }

    return response.json(getSpecificBook);
});

// Route    - /book/aut/:author
// Des      - to get a list of books based on author
// Access   - Public
// Method   - GET
// Params   - author
// Body     - none

Router.get("/aut/:author", async (request, response) => {
    const getSpecificBook = await BookModel.findOne({authors: parseInt(request.params.author)});

    if (!getSpecificBook) {
        return response.json({
            error: `No book found for the author of ${parseInt(request.params.author)}`
    });
    }

    return response.json(getSpecificBook);
});


/* ------------------------ POST APIs -------------------------- */

// Route    - /book/new
// Des      - to add new books
// Access   - Public
// Method   - POST
// Params   - none
// Body     - { newBook : { details } }

Router.post("/new", (request, response) => {
    try {
        const { newBook } = request.body;

        BookModel.create(newBook);
        return response.json({ message: "Book added to the database" });
    }
    catch(error) {
        return response.json({ error: error.message });
    }
});


/* ------------------------ PUT APIs -------------------------- */

// Route    - /book/update/:isbn
// Des      - update book title
// Access   - Public
// Method   - PUT
// Params   - isbn
// Body     - { title: newTtile }

Router.put("/update/:isbn", async (request, response) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        { ISBN: request.params.isbn },
        { title: request.body.title },
        { new: true }
    );

    return response.json(updatedBook);
});

// Route    - /book/updateAuthour/:isbn
// Des      - to update/add new author
// Access   - Public
// Method   - PUT
// Params   - isbn
// Body     - { "newAuthor": id }

Router.put("/updateAuthour/:isbn", async (request, response) => {
    const updatedBook = await BookModel.findOneAndUpdate(
        { ISBN: request.params.isbn },
        { $addToSet: { authors: request.body.newAuthor } },
        { new: true }
    );

    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        { id: request.body.newAuthor },
        { $addToSet: { books: request.params.isbn } },
        { new: true }
    );

    return response.json({ book: updatedBook, author: updatedAuthor });
});


/* ------------------------ DELETE APIs -------------------------- */

// Route    - /book/deleteBook/:BookID
// Des      - to get specific book
// Access   - Public
// Method   - DELETE
// Params   - bookID
// Body     - none

Router.delete("/deleteBook/:BookID", async (request, response) => {
    const updatedBook = await BookModel.findOneAndDelete( 
        { ISBN: request.params.BookID }
    );

    return response.json({ books: updatedBook });
});

// Route    - /book/deleteAuthor/:BookID/:authorID
// Des      - delete an author from the book
// Access   - Public
// Method   - DELETE
// Params   - bookID, authorID
// Body     - none

Router.delete("/deleteAuthor/:BookID/:authorID", async (request, response) => {
    const isbn = request.params.BookID;
    const author_ = parseInt(request.params.authorID);

    const updatedBook = await BookModel.findOneAndUpdate(
        { ISBN: isbn },
        { $pull: { authors: author_ } },
        { new: true }
    );

    const updatedAuthor = await AuthorModel.findOneAndUpdate(
        { id: author_ },
        { $pull: { books: isbn } },
        { new: true }
    );

    return response.json({ book: updatedBook, author: updatedAuthor });
});

module.exports = Router;